import { create } from 'zustand'

interface StoreState {
  uploadStatusMessage: string
  setUploadStatusMessage: (message: string) => void
  encodedEmail: string
  setEncodedEmail: (email: string) => void
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  role: string
  setRole: (roles: string) => void
}

const useStore = create<StoreState>((set) => ({
  uploadStatusMessage: '',
  setUploadStatusMessage: (message) => set({ uploadStatusMessage: message }),
  encodedEmail: '',
  setEncodedEmail: (email) => set({ encodedEmail: email }),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated: isAuthenticated }),
  role: 'USER',
  setRole: (role) => set({ role: role })
}))

export default useStore
