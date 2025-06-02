import CONSTANTS from '@/constants'
import { calculateChecksum, calculateChecksums, formatSize } from '@/lib/utils'
import { ChunkRequestDto } from '@/models/ChunkRequestDto'
import { FileResponseDto } from '@/models/FileResponseDto'
import { StartTransferRequestDto } from '@/models/StartTransferRequestDto'
import { chunkSchema } from '@/schemas/chunk'
import { AxiosProgressEvent } from 'axios'
import api from './apiInstance'
import { uploadChunk } from './chunk'
import { finishTransfer, startTransfer } from './transfer'

export const uploadZipBlob = async (
  blob: Blob,
  fileName: string,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const formData = new FormData()
  formData.append('file', blob, fileName.trim())

  try {
    const response = await api.post('/api/upload', formData, {
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
  chunkRequestDto: ChunkRequestDto,
  retries = 3,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await uploadChunk({ chunkRequestDto, onUploadProgress })

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

// Helper to create a chunk upload task
const createChunkUploadTask = (
  file: FileResponseDto,
  fileData: File,
  chunkIndex: number,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  updateMessageCallback?: (message: string) => void
) => {
  return async () => {
    const start = (chunkIndex - 1) * CONSTANTS.CHUNK_SIZE
    const end = Math.min(start + CONSTANTS.CHUNK_SIZE, file.fileSize)
    const chunk = fileData.slice(start, end)

    const chunkRequestDto: ChunkRequestDto = {
      fileId: file.id,
      chunkIndex,
      chunkSize: chunk.size,
      chunkChecksum: await calculateChecksum(chunk),
      multipartFile: chunk
    }
    const parseResult = chunkSchema.safeParse(chunkRequestDto)
    if (!parseResult.success) {
      console.error('Chunk request DTO validation failed:', parseResult.error)
      throw new Error('Chunk request DTO validation failed')
    }

    if (updateMessageCallback) {
      updateMessageCallback(
        `Uploading chunk ${chunkIndex}/${file.totalChunks} for ${file.fileName} (${formatSize(chunk.size)})`
      )
    }

    try {
      const data = await uploadWithRetry(
        chunkRequestDto,
        CONSTANTS.CHUNK_UPLOAD_RETRIES,
        onUploadProgress
      )
      return { data, size: chunk.size }
    } catch (error) {
      console.error(`Chunk upload error for ${file.fileName} chunk ${chunkIndex}:`, error)
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

      const promise = task().then((result) => {
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

export interface fileUploadData {
  file: File
  uploadName: string
  fileChunks: number
}

export const zipUploadFiles = async (
  files: File[],
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  updateMessageCallback?: (message: string) => void
) => {
  const fileChecksums = await calculateChecksums(files)
  // 1. start transfer
  const startTransferRequest: StartTransferRequestDto = {
    startTime: new Date(),
    files: files.map((file) => ({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileChecksum: fileChecksums.shift() as string,
      chunkSize: CONSTANTS.CHUNK_SIZE,
      totalChunks: Math.ceil(file.size / CONSTANTS.CHUNK_SIZE)
    }))
  }

  const result = await startTransfer(startTransferRequest)

  // Create all chunk upload tasks across all files
  const taskQueue: (() => Promise<{ data: any; size: number }>)[] = []

  for (const file of result.data.files) {
    addUploadChunkTaskToQueue({
      file,
      fileData: files.find((f) => f.name === file.fileName) as File,
      taskQueue,
      onUploadProgress,
      updateMessageCallback
    })
  }

  try {
    if (updateMessageCallback) {
      updateMessageCallback(
        `Starting parallel upload of ${taskQueue.length} chunks with max ${CONSTANTS.MAX_CONCURRENT_UPLOADS} concurrent uploads`
      )
    }

    // Process all tasks with limited concurrency
    await processQueue(taskQueue, CONSTANTS.MAX_CONCURRENT_UPLOADS)

    try {
      return (await finishTransfer(result.data.id)).data
    } catch (finalizeError) {
      console.error(`Failed to finalize transfer ${result.data.id}:`, finalizeError)
      throw new Error(`Transfer finalization failed: ${finalizeError}`)
    }
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}

const addUploadChunkTaskToQueue = async ({
  file,
  fileData,
  taskQueue,
  onUploadProgress,
  updateMessageCallback
}: {
  file: FileResponseDto
  fileData: File
  taskQueue: (() => Promise<{ data: any; size: number }>)[]
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
  updateMessageCallback?: (message: string) => void
}) => {
  for (let chunkIndex = 1; chunkIndex <= file.totalChunks; chunkIndex++) {
    taskQueue.push(
      createChunkUploadTask(file, fileData, chunkIndex, onUploadProgress, updateMessageCallback)
    )
  }
}
