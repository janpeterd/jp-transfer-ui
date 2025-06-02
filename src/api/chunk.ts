import { ChunkRequestDto } from '@/models/ChunkRequestDto'
import api from './apiInstance'
import { AxiosProgressEvent } from 'axios'

export const uploadChunk = async ({
  chunkRequestDto,
  onUploadProgress
}: {
  chunkRequestDto: ChunkRequestDto
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
}) => {
  const formData = new FormData()

  formData.append('fileId', chunkRequestDto.fileId.toString())
  formData.append('chunkIndex', chunkRequestDto.chunkIndex.toString())
  formData.append('chunkSize', chunkRequestDto.chunkSize.toString())
  formData.append('chunkChecksum', chunkRequestDto.chunkChecksum)
  formData.append('multipartFile', chunkRequestDto.multipartFile)

  return api.post('/api/upload', formData, {
    onUploadProgress
  })
}
