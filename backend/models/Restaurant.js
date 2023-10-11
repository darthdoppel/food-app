import { connection } from '../db.js'
import { v4 as uuidv4 } from 'uuid' // Importa el módulo de uuid

export class Restaurant {
  static async find () {
    const [rows] = await connection.execute('SELECT *, BIN_TO_UUID(id) AS id FROM Restaurant')
    return rows
  }

  static async findById (id) {
    const [rows] = await connection.execute('SELECT *, BIN_TO_UUID(id) AS id FROM Restaurant WHERE id = UUID_TO_BIN(?)', [id])
    return rows[0]
  }

  static async create (data) {
    const { name, location, image } = data
    const id = uuidv4() // Genera un nuevo UUID

    // Inserta el nuevo restaurante en la base de datos, incluyendo el UUID generado
    await connection.execute(
      'INSERT INTO Restaurant (id, name, location, image) VALUES (UUID_TO_BIN(?), ?, ?, ?)',
      [id, name, location, image]
    )

    // Retorna los datos del nuevo restaurante, incluyendo el UUID generado
    return { id, name, location, image }
  }

  static async delete (id) {
    await connection.execute('DELETE FROM Restaurant WHERE id = UUID_TO_BIN(?)', [id])
    return { id }
  }

  static async updateImage (id, image) {
    await connection.execute('UPDATE Restaurant SET image = ? WHERE id = UUID_TO_BIN(?)', [image, id])
    return { id, image }
  }

  static async findWithAverageRatings () {
    const sql = `
      SELECT
          r.*,
          AVG(re.rating) AS average_rating
      FROM
          Restaurant AS r
      LEFT JOIN
          Review AS re
      ON
          r.id = re.restaurantId
      GROUP BY
          r.id, r.name, r.location, r.image
    `

    const [rows] = await connection.execute(sql)
    return rows
  }

  static async findWithAverageRatingById (id) {
    const sql = `
      SELECT
          r.*,
          AVG(re.rating) AS average_rating
      FROM
          Restaurant AS r
      LEFT JOIN
          Review AS re
      ON
          r.id = re.restaurantId
      WHERE
          r.id = UUID_TO_BIN(?)
      GROUP BY
          r.id, r.name, r.location, r.image
    `

    const [rows] = await connection.execute(sql, [id])

    // Puedes devolver el primer elemento directamente desde este método,
    // ya que debería haber, como máximo, un restaurante con una ID dada.
    return rows[0]
  }
}
