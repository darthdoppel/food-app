import { Router } from 'express'
import { UserController } from '../controllers/users.js'

const router = Router()

router.post('/register', UserController.registerUser)
router.post('/login', UserController.loginUser)
router.post('/verify', UserController.verifyToken)
router.get('/:id', UserController.getUserById)
router.patch('/:id/avatar', UserController.updateAvatar)
router.delete('/:id', UserController.deleteUser)

export default router
