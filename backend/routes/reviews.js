import { Router } from 'express'
import { ReviewController } from '../controllers/reviews.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', ReviewController.getAll)
router.get('/restaurant/:restaurantId', ReviewController.getByRestaurant)
router.post('/', authMiddleware, ReviewController.create)
router.patch('/:id', authMiddleware, ReviewController.update)
router.delete('/:id', ReviewController.delete)

export default router
