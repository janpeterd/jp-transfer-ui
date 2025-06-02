import axios from 'axios'

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/auth`
})

export default authApi
