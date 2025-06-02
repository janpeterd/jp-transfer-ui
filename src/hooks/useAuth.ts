// hooks/useAuth.js
import { getCurrentUser } from '@/api/users'
import useStore from '@/store/store'
import { useQuery } from '@tanstack/react-query'

export const useAuth = () => {
  const token = localStorage.getItem('token')
  const { isAuthenticated, setIsAuthenticated } = useStore()
  const { data } = useQuery({
    queryKey: ['loggedinUser'],
    queryFn: async () => getCurrentUser(),
    enabled: !!token
  })
  return { isAuthenticated, user: data?.data, setIsAuthenticated }
}
