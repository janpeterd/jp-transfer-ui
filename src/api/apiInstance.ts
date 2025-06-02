import axios from 'axios'
import { refreshToken } from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
})

// Request Interceptor: Add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    // Do not add Authorization header for refresh token requests or other public routes if needed
    // Example: if (token && config.url !== '/auth/refresh-token') {
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

// --- Logic to handle concurrent token refresh requests ---
let isRefreshing = false
let failedQueue = [] // Store requests that failed while token was refreshing

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}
// --- End of concurrent refresh handling ---

// Response Interceptor: Handle 401 errors and token refresh
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response
  },
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const originalRequest = error.config

    // Check if it's a 401 error and not a retry already
    // Also, ensure the error is not from the refresh token endpoint itself to avoid infinite loops
    if (
      error.response?.status === 401 &&
      originalRequest.url !== '/auth/refresh-token' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If token is already refreshing, queue the original request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((newToken) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + newToken
            return api(originalRequest) // Retry with new token
          })
          .catch((err) => {
            return Promise.reject(err) // Could be a new error from the queued request
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
        processQueue(refreshError, null)
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        // window.location.href = '/login'; // Or dispatch a logout action
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
