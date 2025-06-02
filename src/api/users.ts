import { User, UserResponseDto } from '@/models/User'
import api from './apiInstance'

export const createUser = async (user: Partial<User>) => {
  try {
    const response = await api.post('/api/user', {
      ...user
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`)
  }
}

export const getUsers = async () => {
  try {
    return await api.get<UserResponseDto[]>(`/api/user`, {})
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error}`)
  }
}

export const deleteUser = async (userId: number | string) => {
  try {
    const response = await api.delete(`/api/user/${userId}`)
    return response
  } catch (error) {
    throw new Error(`Failed to delete user: ${error}`)
  }
}

export const updateUser = async (userId: number, user: Partial<User>) => {
  try {
    await api.put(`/api/user/${userId}`, user)
  } catch (error) {
    throw new Error(`Failed to update user: ${error}`)
  }
}

export const getCurrentUser = async () => {
  try {
    return await api.get<UserResponseDto>(`/api/user/current`)
  } catch (error) {
    throw new Error(`Failed to fetch current users: ${error}`)
  }
}
