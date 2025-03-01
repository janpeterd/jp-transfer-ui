import { LoginCredentials } from '@/models/LoginCredentials'
import api from './apiInstance'
import { toast } from 'sonner'

export const register = async (loginCredentials: LoginCredentials) => {
  try {
    const response = await api.post('/auth/register', loginCredentials)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('email', response.data.email)
    localStorage.setItem('role', response.data.role)

    return response.data
  } catch (error) {
    throw new Error(`Failed to register: ${error}`)
  }
}

export const login = async (loginCredentials: LoginCredentials) => {
  let response = null
  try {
    response = await api.post('/auth/login', loginCredentials)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('email', response.data.email)
    localStorage.setItem('role', response.data.role)
    toast.success('Successfully logged in')
    return response.data
  } catch (error) {
    if (response?.status == 401) {
      toast.error('Invalid credentials')
    } else {
      toast.error('Failed to login')
    }
    throw new Error(`Failed to register: ${error}`)
  }
}
