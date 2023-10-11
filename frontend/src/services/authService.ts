const BASE_URL = 'http://localhost:3000'

export const registerUser = async (username: string, password: string, email: string): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password, email })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return await response.json()
}

export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return await response.json()
}

export const verifyToken = async (token: string): Promise<User> => {
  const response = await fetch(`${BASE_URL}/user/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Token verification failed')
  }

  const data = await response.json()
  return data.user
}
