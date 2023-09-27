const express = require('express')
const router = express.Router()
const User = require('../models/User')

// Ruta para registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body

    // Validar datos recibidos
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' })
    }

    // Crear usuario nuevo
    const newUser = new User({ username, password, email })
    await newUser.save()

    // Responder al cliente
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser })
  } catch (error) {
    // Manejar errores (por ejemplo, si el username o email ya existen)
    res.status(500).json({ message: 'Error al registrar usuario', error })
  }
})

// Ruta para inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // Validar datos recibidos
    if (!username || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' })
    }

    // Buscar usuario
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Comparar contraseñas
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' })
    }

    // Aquí puedes generar un token JWT u otro método de autenticación si lo deseas

    // Responder al cliente
    res.status(200).json({ message: 'Inicio de sesión exitoso', user })
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al iniciar sesión', error })
  }
})

module.exports = router
