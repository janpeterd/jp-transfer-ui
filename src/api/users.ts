import { User } from '@/models/User'
import api from './apiInstance'

export const createUser = async (user: Partial<User>) => {
  try {
    const response = await api.post('/users', {
      ...user
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`)
  }
}

export const getUsers = async () => {
  try {
    const { data } = await api.get<{
      _embedded: { users: User[] }
    }>(`/users`, {})
    return data._embedded.users
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error}`)
  }
}

export const deleteUser = async (userId: number | string) => {
  try {
    const response = await api.delete(`/users/${userId}`)
    return response
  } catch (error) {
    throw new Error(`Failed to delete user: ${error}`)
  }
}

export const updateUser = async (userId: number, user: Partial<User>) => {
  try {
    await api.put(`/users/${userId}`, user)
  } catch (error) {
    throw new Error(`Failed to update user: ${error}`)
  }
}
