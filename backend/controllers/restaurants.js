import { Restaurant } from '../models/Restaurant.js'
import restaurantSchema from '../schemas/restaurant.js'

export class RestaurantController {
  static async getAll (req, res) {
    try {
      // Use findWithAverageRatings method to always fetch average ratings
      const restaurants = await Restaurant.findWithAverageRatings()
      const modifiedRestaurants = restaurants.map(restaurant => ({
        ...restaurant,
        id: restaurant.id.toString('hex')
      }))
      res.json(modifiedRestaurants)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching restaurants', error })
    }
  }

  static async getOne (req, res) {
    try {
      const { id } = req.params
      const restaurantFound = await Restaurant.findWithAverageRatingById(id)

      // Si no se encuentra el restaurante, devolver un 404
      if (!restaurantFound) {
        res.status(404).json({ message: 'Restaurant not found' })
        return
      }

      // Convertir la ID a cadena y devolver el restaurante
      res.json({
        ...restaurantFound,
        id: restaurantFound.id.toString('hex')
      })
    } catch (error) {
      res.status(500).json({ message: 'Error fetching restaurant', error })
    }
  }

  static async create (req, res) {
    try {
      const { name, location, image, description } = req.body
      const newRestaurantData = {
        name,
        location,
        image,
        description
      }
      const newRestaurant = await Restaurant.create(newRestaurantData)
      res.json({ message: 'Restaurant created', data: newRestaurant })
    } catch (error) {
      res.status(500).json({ message: 'Error creating restaurant', error })
    }
  }

  static async delete (req, res) {
    try {
      const { id } = req.params
      const result = await Restaurant.delete(id)
      res.json(result)
    } catch (error) {
      res.status(500).json({ message: 'Error deleting restaurant', error })
    }
  }

  static async validateRestaurant (req, res) {
    try {
      const result = restaurantSchema.safeParse(req.body)
      if (!result.success) {
        return res.status(400).json({ isValid: false, errors: result.error.errors })
      }
      return res.status(200).json({ isValid: true })
    } catch (error) {
      return res.status(500).json({ message: 'Error validating restaurant', error })
    }
  }

  static async updateImage (req, res) {
    try {
      const { id } = req.params
      const { image } = req.body
      const result = await Restaurant.updateImage(id, image)
      res.json(result)
    } catch (error) {
      res.status(500).json({ message: 'Error updating image', error })
    }
  }
}
