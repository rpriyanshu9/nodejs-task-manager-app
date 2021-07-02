const jwt = require('jsonwebtoken')
const { ObjectID } = require('mongodb')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '')
        const verified = await jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        const { _id } = verified
        const user = await User.findOne({ _id: new ObjectID(_id), 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}

module.exports = auth