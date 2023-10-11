import { create } from 'zustand'

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => { set({ user }) },
  setToken: (token) => { set({ token }) },
  logout: () => {
    localStorage.removeItem('token') // Elimina el token del localStorage en el logout
    set({ user: null, token: null })
  }
}))

export default useAuthStore
