export interface SharedLink {
  id?: number
  url: string
  downloadLink: string
  ownerMailBase64: string
  createdAt?: Date | string
  updatedAt?: Date | string
  expiresAt?: Date | string
  downloads?: number
  maxDownloads?: number
  fileSize: number
  fileName: string
  isProtected?: boolean
  password?: string
}
