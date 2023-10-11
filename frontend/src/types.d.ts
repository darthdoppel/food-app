interface User {
  id: number
  username: string
  password?: string
  email: string
  avatar?: string
}

interface AuthResponse {
  user: User
  token: string
}

interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
}

interface Restaurant {
  data: any
  id: string
  name: string
  location: string
  image?: string
  average_rating: number
  __v: number
}

interface Review {
  id: string
  userId: number
  restaurantId: string
  rating: number
  comment: string
}
