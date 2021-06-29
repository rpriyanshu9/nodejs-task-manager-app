const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

// For parsing plain JSON
app.use(express.json())
// For parsing data sent by a HTML form
// app.use(express.urlencoded({ extended: true }))

app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body)
        const savedTask = await task.save()
        res.send(savedTask)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.listen(port, () => {
    console.log("Server running on", port)
})