import { connection } from '../db.js'
import bcrypt from 'bcryptjs'

export class User {
  static async find () {
    try {
      const [rows] = await connection.execute('SELECT * FROM User')
      return rows
    } catch (error) {
      console.error('Error in find: ', error)
      throw error
    }
  }

  static async findById (id) {
    try {
      if (id === undefined) {
        throw new Error('ID is undefined')
      }

      const [rows] = await connection.execute(
        'SELECT * FROM User WHERE id = ?',
        [id]
      )
      return rows[0]
    } catch (error) {
      console.error('Error in findById: ', error)
      throw error
    }
  }

  static async findByUsername (username) {
    const [rows] = await connection.execute('SELECT * FROM User WHERE username = ?', [username])
    return rows[0]
  }

  static async create (data) {
    const { username, password, email } = data
    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await connection.execute('INSERT INTO User (username, password, email, createdAt) VALUES (?, ?, ?, NOW())', [username, hashedPassword, email])
    return { id: result.insertId, ...data }
  }

  static async comparePassword (candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword)
  }

  static async delete (id) {
    try {
      const [result] = await connection.execute(
        'DELETE FROM User WHERE id = ?',
        [id]
      )
      return result.affectedRows > 0 // Retorna true si se eliminó algún registro.
    } catch (error) {
      console.error('Error in delete: ', error)
      throw error
    }
  }

  static async updateAvatar (id, avatarUrl) {
    try {
      const [result] = await connection.execute(
        'UPDATE User SET avatar = ? WHERE id = ?',
        [avatarUrl, id]
      )
      return result.affectedRows > 0 // Si algún registro fue actualizado, retorna true.
    } catch (error) {
      console.error('Error in updateAvatar: ', error)
      throw error
    }
  }
}
