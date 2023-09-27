const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs') // Para hash de contraseñas

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true // El nombre de usuario debe ser único en la colección
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // El email debe ser único en la colección
  },
  createdAt: {
    type: Date,
    default: Date.now // La fecha de creación será la fecha actual por defecto
  }
})

// Método para hashear la contraseña antes de guardar el usuario
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// Método para comparar contraseñas
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User
