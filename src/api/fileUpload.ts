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
      if (attempt === retries - 1) {
        throw error // Throw on last retry
      }
    }
  }
  throw new Error('Failed to upload file after multiple attempts')
}

// Chunk size - you can adjust this as needed
//const CHUNK_SIZE = 250 * 1024 * 1024
const CHUNK_SIZE = 250 * 1024

// Maximum number of concurrent uploads
const MAX_CONCURRENT_UPLOADS = 4

// Helper to create a chunk upload task
const createChunkUploadTask = (
  file: File,
  chunkIndex: number,
  totalChunks: number,
  uploadName: string,
  email: string,
  retries: number,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  updateMessageCallback?: (message: string) => void
) => {
  return async () => {
    const start = (chunkIndex - 1) * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunk = file.slice(start, end)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('chunked', 'true')
    formData.append('totalChunks', totalChunks.toString())
    formData.append('chunkIndex', chunkIndex.toString())
    formData.append('uploadName', uploadName)
    formData.append('fileName', file.name)
    formData.append(
      'file',
      chunk,
      `${file.name}.chunk.${String(chunkIndex).padStart(5, '0')}_of_${String(totalChunks).padStart(5, '0')}`
    )

    if (updateMessageCallback) {
      updateMessageCallback(
        `Uploading chunk ${chunkIndex}/${totalChunks} for ${file.name} (${formatSize(chunk.size)})`
      )
    }

    try {
      const data = await uploadWithRetry(formData, retries, onUploadProgress)
      return { data, size: chunk.size }
    } catch (error) {
      console.error(`Chunk upload error for ${file.name} chunk ${chunkIndex}:`, error)
      throw error
    }
  }
}

// Function to process a queue of tasks with limited concurrency
async function processQueue<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
  const results: T[] = []
  const inProgress: Promise<void>[] = []
  const tasksIterator = tasks.values()
  let currentTask = tasksIterator.next()
  
  // Process tasks with limited concurrency
  while (!currentTask.done || inProgress.length > 0) {
    // Fill the concurrency slots
    while (!currentTask.done && inProgress.length < concurrency) {
      const task = currentTask.value
      const index = results.length
      
      const promise = task().then(result => {
        results[index] = result
        // Remove this promise from the in-progress array
        const promiseIndex = inProgress.indexOf(promise)
        if (promiseIndex !== -1) {
          inProgress.splice(promiseIndex, 1)
        }
      })
      
      inProgress.push(promise)
      results.push(null as any) // Reserve a spot in results array
      currentTask = tasksIterator.next()
    }
    
    // Wait for at least one task to complete if we have active tasks
    if (inProgress.length > 0) {
      await Promise.race(inProgress)
    }
  }
  
  return results
}

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
  
  // Create all chunk upload tasks across all files
  const allTasks: (() => Promise<{data: any, size: number}>)[] = []
  
  // Build all chunk upload tasks
  for (const file of files) {
    const fileSize = file.size
    const totalChunks = Math.ceil(fileSize / CHUNK_SIZE)
    
    // Create tasks for each chunk
    for (let chunkIndex = 1; chunkIndex <= totalChunks; chunkIndex++) {
      allTasks.push(
        createChunkUploadTask(
          file,
          chunkIndex,
          totalChunks,
          uploadName,
          email,
          retries,
          onUploadProgress,
          updateMessageCallback
        )
      )
    }
  }
  
  try {
    if (updateMessageCallback) {
      updateMessageCallback(`Starting parallel upload of ${allTasks.length} chunks with max ${MAX_CONCURRENT_UPLOADS} concurrent uploads`)
    }
    
    // Process all tasks with limited concurrency
    const results = await processQueue(allTasks, MAX_CONCURRENT_UPLOADS)
    
    // Update shared link and total uploaded size
    for (const result of results) {
      sharedLink = { ...result.data }
      totalUploadedSize += result.size
    }
    
    console.log('Total size chunked uploaded', totalUploadedSize)
    return sharedLink
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}