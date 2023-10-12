import { useRestaurantStore } from '../store/restaurantStore'
const BASE_URL = 'http://localhost:3000'

export async function fetchWithToken (url: string, token: string | null | undefined) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (token != null) {
    headers.append('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  } else {
    return await response.json()
  }
}
export async function fetchRestaurant (id: string, token: string | null | undefined) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (token != null) {
    headers.append('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}/restaurants/${id}`, { headers })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  } else {
    return await response.json()
  }
}

export async function fetchReviews (id: string, token: string | null | undefined) {
  return await fetchWithToken(`${BASE_URL}/reviews/restaurant/${id}`, token)
}

export async function fetchUser (userId: number, token: string | null | undefined) {
  return await fetchWithToken(`${BASE_URL}/user/${userId}`, token)
}

export async function fetchRestaurants () {
  const response = await fetch(`${BASE_URL}/restaurants`)

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  } else {
    return await response.json()
  }
}

export async function createReview (

  review: { rating: number, comment: string, userId: number, restaurantId: string },
  token: string | null | undefined

) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (token != null) {
    headers.append('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers,
    body: JSON.stringify(review)
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Error data:', errorData) // Log error data
    throw new Error(`Error: ${response.status}, ${errorData.message}`)
  }
  return await response.json()
}

export async function deleteReview (id: string, token: string | null | undefined) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (token != null) {
    headers.append('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  } else {
    const responseData = await response.json()
    return responseData
  }
}

export async function createRestaurant (
  newRestaurant: { name: string, location: string, image: string },
  token?: string | null
) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (token != null) {
    headers.append('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}/restaurants`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newRestaurant)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  } else {
    const responseData = await response.json()
    return responseData
  }
}

export async function deleteRestaurant (id: string, token: string | null | undefined) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (token != null) {
    headers.append('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}/restaurants/${id}`, {
    method: 'DELETE',
    headers
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  } else {
    const responseData = await response.json()
    console.log('deleteRestaurant response data:', responseData)
    return responseData
  }
}

export async function updateRestaurantImage (
  id: string,
  image: string,
  token: string | null | undefined
) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (token != null) {
    headers.append('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}/restaurants/${id}/image`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ image })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  } else {
    const responseData = await response.json()
    console.log('updateRestaurantImage response data:', responseData)
    return responseData
  }
}

export async function validateRestaurantData (
  newRestaurant: { name: string, location: string, image: string }
) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  try {
    const response = await fetch(`${BASE_URL}/restaurants/validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newRestaurant)
    })

    // If response is not OK, try to extract error details from the response body,
    // then throw an error with those details.
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(JSON.stringify(errorData))
    }

    // Otherwise, parse and return the JSON data as usual.
    return await response.json()
  } catch (error) {
    // Log the error details to the console and re-throw the error to be handled
    // by the calling code.
    console.error('Error in validateRestaurantData:', error)
    throw error
  }
}

export async function updateReview (
  review: { rating: number, comment: string, id: string },
  token: string | null | undefined
) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (token != null) {
    headers.append('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}/reviews/${review.id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      rating: review.rating,
      comment: review.comment
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Error data:', errorData) // Log error data
    throw new Error(`Error: ${response.status}, ${errorData.message}`)
  }
  return await response.json()
}

export async function handleCreateReview (
  review: { rating: number, comment: string, userId: number, restaurantId: string },
  token: string | null | undefined
) {
  try {
    const newReview = await createReview(review, token)

    // Añadir la nueva reseña al estado local para que se muestre en la UI.
    useRestaurantStore.getState().setReviews((prevReviews) => [...prevReviews, newReview.data])

    // Comprobar si el usuario ya está en el estado local.
    const userExists = useRestaurantStore.getState().users.some((user) => user.id === review.userId)

    // Si el usuario no está en el estado, obtener los datos del usuario y añadirlos al estado.
    if (!userExists) {
      const newUser = await fetchUser(review.userId, token)
      useRestaurantStore.getState().setUsers((prevUsers) => [...prevUsers, newUser])
    }
  } catch (error) {
    console.error('Error creating review:', error)
  }
}
