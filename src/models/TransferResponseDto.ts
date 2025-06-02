import { FileResponseDto } from './FileResponseDto'
import { SharedLink } from './SharedLink'
import { User } from './User'

export interface TransferResponseDto {
  id: number
  startTime: Date
  endTime: Date
  user: User
  totalSize: number
  files: FileResponseDto[]
  sharedLink: SharedLink
}
