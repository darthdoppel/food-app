import { connection } from '../db.js'

export class Review {
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
    const [result] = await connection.execute('INSERT INTO Review (userId, restaurantId, rating, comment) VALUES (?, UUID_TO_BIN(?), ?, ?)', [userId, restaurantId, rating, comment])
    return { id: result.insertId, ...data }
  }

  static async delete (id) {
    await connection.execute('DELETE FROM Review WHERE id = ?', [id])
    return { id }
  }

  static async update (id, updatedData) {
    try {
      // Desestructuramos los datos a actualizar
      const { rating, comment } = updatedData

      // Ejecutamos la consulta de actualización
      const [result] = await connection.execute(
        'UPDATE Review SET rating = ?, comment = ? WHERE id = ?',
        [rating, comment, id]
      )
      console.log('SQL Update Result: ', result)

      // Retorna true si la actualización fue exitosa
      return result.affectedRows > 0
    } catch (error) {
      console.error('Error in update: ', error)
      throw error
    }
  }
}
