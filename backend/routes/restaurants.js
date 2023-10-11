import { Router } from 'express'
import { RestaurantController } from '../controllers/restaurants.js'
import restaurantSchema from '../schemas/restaurant.js'
import { validate } from '../middlewares/validationMiddleware.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', RestaurantController.getAll)
router.get('/:id', RestaurantController.getOne)
router.post('/', authMiddleware, validate(restaurantSchema), RestaurantController.create)
router.patch('/:id/image', authMiddleware, RestaurantController.updateImage)
router.delete('/:id', authMiddleware, RestaurantController.delete)
router.post('/validate', RestaurantController.validateRestaurant)

export default router
