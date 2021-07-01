const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: String,
        default: false,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true })

const Task = mongoose.model('Task', taskSchema)

module.exports = Task