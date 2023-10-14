import { create } from 'zustand'
import { fetchUser } from '../services/ApiService'

interface RestaurantState {
  restaurant: Restaurant | null
  restaurants: Restaurant[]
  reviews: Review[]
  users: User[]
  setRestaurant: (restaurant: Restaurant) => void
  setRestaurants: (restaurants: Restaurant[]) => void
  addRestaurant: (restaurant: Restaurant) => void
  setReviews: (fn: (reviews: Review[]) => Review[]) => void
  setUsers: (fn: (prevUsers: User[]) => User[]) => void
  addUser: (user: User) => void
  loadUsers: (reviews: Review[], token: string) => Promise<void>
  isLoading: boolean
  setLoading: (isLoading: boolean) => void
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurant: null,
  restaurants: [],
  reviews: [],
  users: [],
  setRestaurant: (restaurant) => { set(() => ({ restaurant })) },
  setRestaurants: (restaurants) => { set({ restaurants }) },
  addRestaurant: (restaurant) => {
    set((state) => {
      const newRestaurants = [...state.restaurants, restaurant]
      return { restaurants: newRestaurants }
    })
  },
  setReviews: (fn) => {
    set((state) => {
      const newReviews = fn(state.reviews)
      return { reviews: newReviews }
    })
  },

  setUsers: (fn) => { set((state) => ({ users: fn(state.users) })) },
  addUser: (user) => {
    set((state) => {
      // Verificar si el usuario ya existe en el estado.
      const userExists = state.users.some((u) => u.id === user.id)
      if (!userExists) {
        // Si no existe, agregar al estado.
        const newUsers = [...state.users, user]
        return { users: newUsers }
      }
      // Devolver el estado actual si el usuario ya existe.
      return state
    })
  },
  isLoading: false,
  setLoading: (isLoading) => { set(() => ({ isLoading })) },
  loadUsers: async (reviews: Review[], token: string) => {
    set({ isLoading: true }) // Indicar que la carga ha comenzado
    let currentUsers = get().users

    for (const review of reviews) {
      const userExists = currentUsers.some(u => u.id === review.userId)
      if (!userExists) {
        try {
          const fetchedUser = await fetchUser(review.userId, token)
          currentUsers = [...currentUsers, fetchedUser.user]
          set({ users: currentUsers })
        } catch (error) {
          console.error('Error loading user:', error)
        }
      }
    }
    set({ isLoading: false }) // Indicar que la carga ha terminado
  }
}))
