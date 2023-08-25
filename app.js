const express = require('express')

const app = express()
app.use(express.json())

const userRoutes = require('./src/Routes/User')
app.use('/user', userRoutes)

const bookRoutes = require('./src/Routes/Book')
app.use('/book', bookRoutes)
const authorRoutes = require('./src/Routes/Author')
app.use('/author', authorRoutes)

const mongoose = require('mongoose')
//const env = require('dotenv/config')
require('dotenv').config()
mongoose.connect(process.env.DB, (err) => {
    if (err) return console.log(err.message)

    console.log('Database connected')
})

app.listen(process.env.PORT||3000, () => {
    console.log('server is up and running !!!')
})

