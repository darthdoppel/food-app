import mysql from 'mysql2/promise'
import { config } from 'dotenv'
config()

export const connection = await mysql.createConnection(process.env.DATABASE_URL)
