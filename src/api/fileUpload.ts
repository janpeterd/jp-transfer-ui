import { AxiosProgressEvent } from 'axios'
import api from './apiInstance'
import { formatSize } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'
import { SharedLink } from '@/models/SharedLink'

export const uploadZipBlob = async (
  blob: Blob,
  fileName: string,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const formData = new FormData()
  formData.append('file', blob, fileName.trim())

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to upload zip: ${error}`)
  }
}

const uploadWithRetry = async (
  formData: FormData,
  retries = 3,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await api.post('/upload', formData, {
        onUploadProgress,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error(`Upload attempt ${attempt + 1} failed:`, error)
    }
  }
  throw new Error('Failed to upload file after multiple attempts')
}

// Chunk size - you can adjust this as needed
const CHUNK_SIZE = 250 * 1024 * 1024

export const zipUploadFiles = async (
  files: File[],
  retries = 3,
  email: string,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  updateMessageCallback?: (message: string) => void
) => {
  const uploadName = uuidv4().replace(/[^a-z0-9]/gi, '_') // Generate uploadName once

  let sharedLink: SharedLink | undefined = undefined
  let totalUploadedSize = 0

  for (const file of files) {
    const fileSize = file.size
    const totalChunks = Math.ceil(fileSize / CHUNK_SIZE)

    for (let chunkIndex = 1; chunkIndex <= totalChunks; chunkIndex++) {
      const start = (chunkIndex - 1) * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, fileSize)
      const chunk = file.slice(start, end)

      const formData = new FormData()
      formData.append('email', email)
      formData.append('chunked', 'true')
      formData.append('totalChunks', totalChunks.toString())
      formData.append('chunkIndex', chunkIndex.toString())
      formData.append('uploadName', uploadName) // Use the same uploadName for all chunks
      formData.append('fileName', file.name)
      formData.append(
        'file',
        chunk,
        `${file.name}.chunk.${String(chunkIndex).padStart(5, '0')}_of_${String(totalChunks).padStart(5, '0')}`
      ) // Send raw chunk

      try {
        if (updateMessageCallback) {
          updateMessageCallback(
            `Uploading chunk ${chunkIndex}/${totalChunks} for ${file.name} (${formatSize(chunk.size)})`
          )
        }
        const data = await uploadWithRetry(formData, retries, onUploadProgress)
        sharedLink = {
          ...data
        }
        totalUploadedSize += chunk.size
      } catch (error) {
        console.error('Chunk upload error:', error)
        throw error // Re-throw to stop the process if a chunk fails
      }
    }
  }

  console.log('total size chunked uploaded', totalUploadedSize)
  return sharedLink
}
