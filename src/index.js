require('dotenv').config()
require('./db/mongoose')
const path = require('path')
const express = require('express')
const taskRoutes = require('./routes/task')
const userRoutes = require('./routes/user')

const app = express()
const port = process.env.PORT

// For parsing plain JSON
app.use(express.json())
// For parsing data sent by a HTML form
// app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// Routes
app.get('/', (req, res) => res.render('homepage'))
app.use('/tasks', taskRoutes)
app.use('/users', userRoutes)


app.listen(port, () => {
    console.log("Server running on", port)
})