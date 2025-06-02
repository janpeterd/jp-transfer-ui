export interface FileResponseDto {
  id: number
  fileName: string
  filePath: string
  fileType: string
  fileSize: number
  fileChecksum: string
  totalChunks: number
}
