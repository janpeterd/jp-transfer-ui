export interface FileRequestDto {
  fileName: string
  fileType: string
  fileSize: number
  fileChecksum: string
  chunkSize: number
  totalChunks: number
}
