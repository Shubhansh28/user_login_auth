const express = require('express');
const { config } = require("dotenv")
const path = require('path')
config({
  path: path.join(__dirname, '..', '.env')
});
const authRoutes = require('./routes/authRoutes')
const itemRoutes = require('./routes/itemRoutes')
const app = express()
const port = process.env.PORT

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/', authRoutes)
app.use('/items',itemRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})