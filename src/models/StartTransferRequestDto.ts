import { FileRequestDto } from './FileRequestDto'

export interface StartTransferRequestDto {
  startTime: Date
  files: FileRequestDto[]
}
