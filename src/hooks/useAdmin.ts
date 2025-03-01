// hooks/useAuth.js
import useStore from '@/store/store'

export const useAdmin = () => {
  const { role } = useStore()
  return role.toLowerCase() === 'admin'
}
