import { LoginCredentials } from '@/models/LoginCredentials'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import api from './apiInstance'
import authApi from './authApiInstance'

export const register = async (loginCredentials: LoginCredentials) => {
  try {
    const response = await api.post('/auth/register', loginCredentials)
    localStorage.setItem('token', response.data.authToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)

    return response.data
  } catch (error) {
    throw new Error(`Failed to register: ${error}`)
  }
}

export const login = async (loginCredentials: LoginCredentials) => {
  let response = null
  try {
    response = await authApi.post('/login', loginCredentials)
    localStorage.setItem('token', response.data.authToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)
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

export const setPassword = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/set-password', {
      email,
      password
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to set password: ${error}`)
  }
}

export const changePassword = async ({
  password,
  newPassword
}: {
  password: string
  newPassword: string
}) => {
  try {
    const response = await api.post('/auth/change-password', {
      password,
      newPassword
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to change password: ${error}`)
  }
}

export const refreshToken = async () => {
  const currentRefreshToken = localStorage.getItem('refreshToken')
  if (!currentRefreshToken) {
    console.error('No refresh token available.')
    localStorage.removeItem('token')
    // window.location.href = '/login'
    return Promise.reject(new Error('Session expired'))
  }

  try {
    const response = await authApi.post(`/refresh-token`, null, {
      params: {
        refreshToken: currentRefreshToken
      }
    })

    const { authToken, refreshToken: newRefreshToken } = response.data

    if (!authToken) {
      throw new Error('New access token not received.')
    }

    localStorage.setItem('token', authToken)
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken)
    }

    return authToken
  } catch (error) {
    console.error('Failed to refresh token:', error)
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    // window.location.href = '/login'
    throw new Error(
      `Failed to refresh token: ${error instanceof AxiosError ? error.message : error}`
    )
  }
}
