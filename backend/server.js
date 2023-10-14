// server.js
import { config } from 'dotenv'

import app from './app.js'
import { connectToDatabase } from './db.js'
import pkg from 'picocolors'
config()
const { green } = pkg

const port = process.env.PORT || 3000

// Connect to the database before starting the server
connectToDatabase().then(() => {
  app.listen(port, () => console.log(green(`Server running on port ${port}`)))
})
