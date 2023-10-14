// db.js
import mysql from 'mysql2/promise'
import { config } from 'dotenv'
config()

console.log('DATABASE_URL:', process.env.DATABASE_URL)

let connection

export const connectToDatabase = async () => {
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL)
    console.log('Connected to database')
  } catch (error) {
    console.error('Could not connect to database:', error)
    process.exit(1)
  }
}

export { connection }
