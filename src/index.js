const express = require('express')
require('./db/mongoose')
const taskRoutes = require('./routes/task')
const userRoutes = require('./routes/user')

const app = express()
const port = process.env.PORT || 3000

// For parsing plain JSON
app.use(express.json())
// For parsing data sent by a HTML form
// app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/tasks', taskRoutes)
app.use('/users', userRoutes)


app.listen(port, () => {
    console.log("Server running on", port)
})