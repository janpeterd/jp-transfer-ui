export interface ChunkRequestDto {
  fileId: number
  chunkIndex: number
  chunkSize: number
  chunkChecksum: string
  multipartFile: Blob
}
