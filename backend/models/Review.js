import { connection } from '../db.js'

export class Review {
  static async isValidUserId (userId) {
    const [rows] = await connection.execute('SELECT * FROM User WHERE id = ?', [userId])
    return rows.length > 0
  }

  static async isValidRestaurantId (restaurantId) {
    const [rows] = await connection.execute('SELECT * FROM Restaurant WHERE id = UUID_TO_BIN(?)', [restaurantId])
    return rows.length > 0
  }

  static async find () {
    const [rows] = await connection.execute('SELECT * FROM Review')
    return rows
  }

  static async findByRestaurantId (restaurantId) {
    const [rows] = await connection.execute('SELECT * FROM Review WHERE restaurantId = UUID_TO_BIN(?)', [restaurantId])
    return rows
  }

  static async findById (id) {
    const [rows] = await connection.execute('SELECT * FROM Review WHERE id = ?', [id])
    return rows[0]
  }

  static async create (data) {
    const { userId, restaurantId, rating, comment } = data

    // Validate userId and restaurantId
    if (!await this.isValidUserId(userId) || !await this.isValidRestaurantId(restaurantId)) {
      throw new Error('Invalid userId or restaurantId')
    }

    const [result] = await connection.execute('INSERT INTO Review (userId, restaurantId, rating, comment) VALUES (?, UUID_TO_BIN(?), ?, ?)', [userId, restaurantId, rating, comment])
    return { id: result.insertId, ...data }
  }

  static async delete (id) {
    await connection.execute('DELETE FROM Review WHERE id = ?', [id])
    return { id }
  }

  static async update (id, updatedData) {
    try {
      const { userId, restaurantId, rating, comment } = updatedData

      // Validate userId and restaurantId if they are provided in updatedData
      if (
        (userId && !await this.isValidUserId(userId)) ||
        (restaurantId && !await this.isValidRestaurantId(restaurantId))
      ) {
        throw new Error('Invalid userId or restaurantId')
      }

      const [result] = await connection.execute('UPDATE Review SET rating = ?, comment = ? WHERE id = ?', [rating, comment, id])
      return result.affectedRows > 0
    } catch (error) {
      console.error('Error in update: ', error)
      throw error
    }
  }
}
