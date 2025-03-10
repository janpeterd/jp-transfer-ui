import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/hal+json'
  }
})

// Add a request interceptor to set the Authorization header
api.interceptors.request.use(
  async (config) => {
    // add email to the request header
    const jwt = localStorage.getItem('token')
    // dont do it when request to /logout
    if (jwt) {
      config.headers['Authorization'] = `Bearer ${jwt}`
    }
    // if request is a patch set jsonpatch content type
    if (config.method === 'patch') {
      config.headers['Content-Type'] = 'application/json-patch+json'
    }
    return config
  },
  (error) => {
    console.error('rejecting request, there is no access token')
    return Promise.reject(error)
  }
)

export default api
