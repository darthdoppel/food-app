import { Review } from '../models/Review.js'

function bufferToUuid (buffer) {
  const hex = buffer.toString('hex')
  const uuid = [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20)
  ].join('-')
  return uuid
}

export class ReviewController {
  static async getAll (req, res) {
    try {
      let reviews = await Review.find()

      // Convertir restaurantId de Buffer a UUID
      reviews = reviews.map(review => {
        if (!review.restaurantId) {
          console.error('Review with missing restaurantId:', review)
          // Decide cómo manejar este caso, tal vez omitiendo esta review,
          // o devolviendo un error, o asignando un restaurantId por defecto, etc.
        }
        review.restaurantId = bufferToUuid(review.restaurantId)
        return review
      })

      res.json(reviews)
    } catch (error) {
      console.error('Error in getAll:', error) // Log detallado del error
      res.status(500).json({ message: 'Error fetching reviews', error: error.message })
    }
  }

  static async getByRestaurant (req, res) {
    try {
      const { restaurantId } = req.params
      const reviews = await Review.findByRestaurantId(restaurantId)
      res.json(reviews)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews for the restaurant', error })
    }
  }

  static async create (req, res) {
    try {
      const { restaurantId, rating, comment } = req.body
      const { userId } = req.user

      // Verificar que todos los datos necesarios están presentes
      if (!userId || !restaurantId || rating == null || !comment) {
        res.status(400).json({ message: 'All fields are required' })
        return
      }

      // Añadir validaciones de datos de entrada aquí
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        res.status(400).json({ message: 'Rating must be an integer between 1 and 5' })
        return
      }

      // Continuar como estaba previamente
      const newReviewData = {
        userId,
        restaurantId,
        rating,
        comment
      }
      const newReview = await Review.create(newReviewData)
      res.json({ message: 'Review created', data: newReview })
    } catch (error) {
      res.status(500).json({ message: 'Error creating review', error })
    }
  }

  static async delete (req, res) {
    try {
      const { id } = req.params
      const result = await Review.delete(id)
      res.json(result)
    } catch (error) {
      res.status(500).json({ message: 'Error deleting review', error })
    }
  }

  static async update (req, res) {
    try {
      const { id } = req.params
      const { rating, comment } = req.body
      const { userId } = req.user

      // Buscar la reseña en la base de datos
      const review = await Review.findById(id)

      // Verificar que la reseña existe
      if (!review) {
        return res.status(404).json({ message: 'Review not found' })
      }

      // Verificar que el usuario autenticado es el creador de la reseña
      if (review.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden: You can only edit your own reviews' })
      }

      // Actualizar la reseña
      const success = await Review.update(id, { rating, comment })

      if (success) {
        return res.status(200).json({ message: 'Review updated successfully', data: { rating, comment } })
      } else {
        return res.status(404).json({ message: 'Review not found' })
      }
    } catch (error) {
      console.error('Error in update:', error)
      return res.status(500).json({ message: 'Error updating review', error })
    }
  }
}
