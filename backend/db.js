import mysql from 'mysql2/promise'
import { config } from 'dotenv'
config()

console.log('DATABASE_URL:', process.env.DATABASE_URL) // Add this line

export const connection = await mysql.createConnection(process.env.DATABASE_URL)
