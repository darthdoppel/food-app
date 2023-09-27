require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const userRoutes = require('./routes/UserRoutes')

app.use(cors())
app.use(express.json())
app.use('/user', userRoutes)

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'food-app-db'
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err))

app.listen(port, () => console.log(`Listening on port ${port}...`))
