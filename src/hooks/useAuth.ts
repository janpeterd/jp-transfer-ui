// hooks/useAuth.js
import useStore from '@/store/store';

export const useAuth = () => {
  const { isAuthenticated } = useStore();
  return isAuthenticated;
};
