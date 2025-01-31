const express = require('express')
const http = require('http')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { default: mongoose } = require('mongoose')
const errorMiddleware = require('./middlewares/error.middleware')
require('dotenv').config()

const app = express()

app.use(
  cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('./routes'))

app.use(errorMiddleware)

const server = http.createServer(app)
const PORT = process.env.PORT || 5001

const bootstrap = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDb connected'))
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  } catch (error) {
    console.error(error)
  }
}

bootstrap()

server.on('error', error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  switch (error.code) {
    case 'EACCES':
      console.log(`Port ${PORT} requires elevated privileges.`)
      process.exit(1)
    case 'EADDRINUSE':
      console.log(`Port ${PORT} is already in use.`)
      process.exit(1)
    default:
      throw error
  }
})
