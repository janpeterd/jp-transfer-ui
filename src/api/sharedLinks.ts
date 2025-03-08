import { SharedLink } from '@/models/SharedLink'
import api from './apiInstance'

export const createSharedLink = async (sharedLink: Partial<SharedLink>) => {
  try {
    const response = await api.post('/sharedLinks', {
      ...sharedLink
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to create sharedLink: ${error}`)
  }
}

export const getUserSharedLinks = async (encodedEmail: string) => {
  try {
    const { data } = await api.get<{
      _embedded: { sharedLinks: SharedLink[] }
    }>(`/sharedLinks/search/findSharedLinksByOwnerMailBase64?sort=createdAt,desc`, {
      params: {
        encodedEmail
      }
    })
    return data._embedded.sharedLinks
  } catch (error) {
    throw new Error(`Failed to fetch sharedLinks: ${error}`)
  }
}

export const deleteSharedLink = async (sharedLinkId: number | string) => {
  try {
    await api.delete(`/sharedLinks/${sharedLinkId}`)
  } catch (error) {
    throw new Error(`Failed to delete sharedLink: ${error}`)
  }
}

export const updateSharedLink = async (sharedLinkId: number, sharedLink: Partial<SharedLink>) => {
  try {
    await api.put(`/sharedLinks/${sharedLinkId}`, sharedLink)
  } catch (error) {
    throw new Error(`Failed to update sharedLink: ${error}`)
  }
}

export const getSharedLink = async (sharedLinkId: number | string) => {
  try {
    const { data } = await api.get<SharedLink>(`/sharedLinks/${sharedLinkId}`)
    return data
  } catch (error) {
    throw new Error(`Failed to get sharedLink: ${error}`)
  }
}
