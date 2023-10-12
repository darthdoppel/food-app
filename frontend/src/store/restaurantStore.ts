import { create } from 'zustand'

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
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurant: null,
  restaurants: [],
  reviews: [],
  users: [],
  setRestaurant: (restaurant) => { set({ restaurant }) },
  setRestaurants: (restaurants) => { set({ restaurants }) },
  addRestaurant: (restaurant) => {
    set((state) => {
      const newRestaurants = [...state.restaurants, restaurant]
      return { restaurants: newRestaurants }
    })
  },
  setReviews: (fn) => {
    set((state) => {
      const newReviews = fn(state.reviews)// Log new state
      return { reviews: newReviews }
    })
  },
  setUsers: (fn) => { set((state) => ({ users: fn(state.users) })) }
}))
