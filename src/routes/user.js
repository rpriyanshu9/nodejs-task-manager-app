const express = require('express')
const multer = require('multer')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')

// Create
router.post('/', async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send(e)
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email, password)
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(500).send(e)
    }
})

// Logout
router.post('/logout', auth, async (req, res) => {
    try {
        const { user, token: userToken } = req
        user.tokens = user.tokens.filter((t) => {
            return t.token !== userToken
        })
        await user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Logout All
router.post('/logoutAll', auth, async (req, res) => {
    try {
        const { user } = req
        user.tokens = []
        await user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Read
router.get('/me', auth, async (req, res) => {
    res.send(req.user)
})

// Update
router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid Updates.' })
    }

    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        const updatedUser = await user.save()
        if (!updatedUser) return res.status(404).send()
        res.send(updatedUser)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Delete
router.delete('/me', auth, async (req, res) => {
    try {
        const deletedUser = await req.user.remove()
        res.send(deletedUser)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Upload profile picture avatar endpoints
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image.'))
        }
        cb(undefined, true)
    }
})

router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message })
})

router.delete('/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) throw new Error()
        res.set('Content-Type', 'image/png ')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router

