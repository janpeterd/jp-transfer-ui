import { StorageInfo } from '@/models/StorageInfo'
import api from './apiInstance'

export const getStorageInfo = async () => {
  try {
    const response = await api.get<StorageInfo>('/storage/info')
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch sharedLinks: ${error}`)
  }
}

export const getUserStorageInfo = async () => {
  try {
    const response = await api.get<number>('/storage/info/current-user')
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch sharedLinks: ${error}`)
  }
}
