import axios from 'axios'
import { refreshToken } from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

interface FailedQueueItem {
  resolve: (token: string | null) => void
  reject: (error: Error) => void
}

// And failedQueue itself would be:
let failedQueue: FailedQueueItem[] = []
let isRefreshing = false

const processQueue = (error: Error | null, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest.url !== '/auth/refresh-token' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((newToken) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + newToken
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newAccessToken = await refreshToken()

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

        const retryResponse = await api(originalRequest)
        processQueue(null, newAccessToken)
        return retryResponse
      } catch (refreshError) {
        console.error('Token refresh failed, logging out or redirecting:', refreshError)
        processQueue(refreshError as Error, null)
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login' // Or dispatch a logout action
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
