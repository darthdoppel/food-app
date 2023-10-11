import express, { json } from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import userRoutes from './routes/users.js'
import restaurantRoutes from './routes/restaurants.js'
import reviewRoutes from './routes/reviews.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'

const app = express()

// Obten la ruta al directorio del módulo actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Sirve los archivos estáticos desde la carpeta "avatars"
app.use('/avatars', express.static(path.join(__dirname, 'avatars')))

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use('/user', userRoutes)
app.use('/restaurants', restaurantRoutes)
app.use('/reviews', reviewRoutes)
app.use(errorMiddleware)

export default app
