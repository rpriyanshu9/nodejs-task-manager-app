const express = require('express')
const router = express.Router()
const Task = require('../models/task')

// Create
router.post('/', async (req, res) => {
    try {
        const task = new Task(req.body)
        const savedTask = await task.save()
        res.send(savedTask)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Read
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findById(id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Update
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid Updates.' })
    }

    try {
        const { id } = req.params
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (!updatedTask) return res.status(404).send()
        res.send(updatedTask)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedTask = await Task.findByIdAndDelete(id)
        if (!deletedTask) return res.status(400).send({ error: "Unable to find the Task!" })
        res.send(deletedTask)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router