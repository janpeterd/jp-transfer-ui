import { StartTransferRequestDto } from '@/models/StartTransferRequestDto'
import { TransferResponseDto } from '@/models/TransferResponseDto'
import api from './apiInstance'

export const startTransfer = async (startTransferRequestDto: StartTransferRequestDto) => {
  return api.post<TransferResponseDto>('/api/transfer', startTransferRequestDto, {})
}

export const getTransfer = async (id: number) => {
  return api.get<TransferResponseDto>(`/api/transfer/${id}`)
}

export const getUserTransfers = async () => {
  return api.get<TransferResponseDto[]>(`/api/transfer`)
}

export const deleteTransfer = async (id: number) => {
  return api.delete(`/api/transfer/${id}`)
}

export const getTransferByLinkUuid = async (uuid: string) => {
  return api.get<TransferResponseDto>(`/api/transfer/uuid/${uuid}`)
}

export const finishTransfer = async (id: number) => {
  return api.post<TransferResponseDto>(`/api/transfer/${id}/finish`, {})
}
