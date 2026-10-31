const express = require('express');
const { config } = require("dotenv")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
config({
  path: path.join(__dirname, '..', '.env')
});
const authRoutes = require('./routes/authRoutes')
const itemRoutes = require('./routes/itemRoutes')
const app = express()
const port = process.env.PORT

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || false,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/', authRoutes)
app.use('/items',itemRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})