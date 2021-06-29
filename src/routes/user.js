const express = require('express')
const router = express.Router()
const User = require('../models/user')


// Create
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body)
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Read
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Update
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid Updates.' })
    }

    try {
        const { id } = req.params
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (!updatedUser) return res.status(404).send()
        res.send(updatedUser)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedUser = await User.findByIdAndDelete(id)
        if (!deletedUser) return res.status(400).send({ error: "Unable to find the user!" })
        res.send(deletedUser)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router

