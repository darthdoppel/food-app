import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const secret = process.env.JWT_SECRET

export class UserController {
  static validateEmail (email) {
    const re = /^\S+@\S+\.\S+$/
    return re.test(String(email).toLowerCase())
  }

  static async registerUser (req, res) {
    try {
      const { username, password, email } = req.body
      if (!username || !password || !email) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' })
      }

      // Validar que el email sea válido
      if (!UserController.validateEmail(email)) { // <-- Cambio aquí
        return res.status(400).json({ message: 'Email inválido' })
      }

      const newUser = await User.create({ username, password, email })
      res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser })
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar usuario', error })
    }
  }

  static async loginUser (req, res) {
    try {
      const { username, password } = req.body

      // Validar datos recibidos
      if (!username || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' })
      }

      // Buscar usuario
      const user = await User.findByUsername(username)

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      // Comparar contraseñas
      const isMatch = await User.comparePassword(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' })
      }

      // Generar un token JWT
      const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' })

      // Responder al cliente
      res.status(200).json({ message: 'Inicio de sesión exitoso', user, token })
    } catch (error) {
      // Manejar errores
      res.status(500).json({ message: 'Error al iniciar sesión', error })
    }
  }

  static async getUserById (req, res) {
    try {
      const { id } = req.params
      const user = await User.findById(id)
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }
      res.status(200).json({ user })
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar usuario', error })
    }
  }

  static async verifyToken (req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1] // Extrae el token del header de autorización
      if (!token) {
        return res.status(401).json({ message: 'Token requerido' })
      }

      // Verificar el token
      jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Token inválido' })
        }

        // Buscar el usuario correspondiente al token
        const user = await User.findById(decoded.userId)
        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        // Devolver los datos del usuario
        res.status(200).json({ user })
      })
    } catch (error) {
      res.status(500).json({ message: 'Error al verificar token', error })
    }
  }

  static async updateAvatar (req, res) {
    try {
      const { id } = req.params
      const { avatarUrl } = req.body

      if (!avatarUrl) {
        return res.status(400).json({ message: 'avatarUrl is required' })
      }

      const success = await User.updateAvatar(id, avatarUrl)

      if (!success) {
        return res.status(404).json({ message: 'User not found or avatar already up-to-date' })
      }

      res.status(200).json({ message: 'Avatar updated successfully' })
    } catch (error) {
      console.error('Error in updateAvatar: ', error)
      res.status(500).json({ message: 'Error updating avatar', error })
    }
  }

  static async deleteUser (req, res) {
    try {
      const { id } = req.params
      const success = await User.delete(id)
      if (!success) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }
      res.status(200).json({ message: 'Usuario eliminado exitosamente' })
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar usuario', error })
    }
  }
}
