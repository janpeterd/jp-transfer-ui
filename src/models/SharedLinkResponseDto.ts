export interface SharedLink {
  id: number
  url: string
  downloadLink: string
  transferId: number
  createdAt: Date | string
  updatedAt: Date | string
  expiresAt: Date | string
  downloads: number
  maxDownloads?: number
}
