import app from './app.js'
import pkg from 'picocolors'
const { green } = pkg

const port = process.env.PORT || 3000

app.listen(port, () => console.log(green(`Server running on port ${port}`)))
