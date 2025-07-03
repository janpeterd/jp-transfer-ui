import { clsx, type ClassValue } from 'clsx'
import { createSHA1, IHasher } from 'hash-wasm'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to convert hex to rgba
export const hexToRgbA = (hex: string, alpha: number) => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '')

  // Parse r, g, b values
  let r: number, g: number, b: number
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else {
    r = parseInt(hex.slice(0, 2), 16)
    g = parseInt(hex.slice(2, 4), 16)
    b = parseInt(hex.slice(4, 6), 16)
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// function to convert size to readable format (KB, MB, GB)
export function formatSize(size: number) {
  if (size < 1024) {
    return size + ' Bytes'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB'
  } else {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
  }
}

export const formatDateToBackendISO = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

export const calculateChecksum = async (
  data: File | Blob,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const hasher: IHasher = await createSHA1()
  hasher.init()

  // Create a ReadableStream from the File object
  const stream = data.stream()
  let bytesProcessed = 0

  for await (const chunk of stream) {
    hasher.update(chunk)

    // For progress tracking
    if (onProgress) {
      bytesProcessed += chunk.length
      onProgress(bytesProcessed / data.size)
    }
  }

  return hasher.digest('hex')
}

export const calculateChecksums = async (files: File[]) => {
  const checksums: string[] = []
  for (const file of files) {
    const checksum = await calculateChecksum(file)
    checksums.push(checksum)
  }
  return checksums
}
