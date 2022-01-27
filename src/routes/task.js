const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

// Create
router.post('/', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            author: req.user._id
        })
        const savedTask = await task.save()
        res.status(201).send(savedTask)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Read
router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findOne({ _id: id, author: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/', auth, async (req, res) => {

    // For filtering
    const match = {}
    // For Sorting
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    try {
        const tasks = await req.user.populate({
            path: 'tasks',
            match,
            options: {
                // For pagination
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Update
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid Updates.' })
    }

    try {
        const { id } = req.params

        const task = await Task.findOne({ _id: id, author: req.user._id })

        if (!task) return res.status(404).send()

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Delete
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params
        const deletedTask = await Task.findOneAndDelete({ _id: id, author: req.user._id })
        if (!deletedTask) return res.status(400).send({ error: "Unable to find the Task!" })
        res.send(deletedTask)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router