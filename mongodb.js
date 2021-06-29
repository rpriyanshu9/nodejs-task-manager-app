const { MongoClient, ObjectID } = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    if (err) {
        return console.log("Unable to connect to database")
    }
    console.log("Connected to mongodb!")
    const db = client.db(databaseName)

    // Create
    // try {
    //     const result = await db.collection('tasks').insertMany([
    //         {
    //             description: 'to do a leetcode problem',
    //             completed: false
    //         },
    //         {
    //             description: 'Read DBMS',
    //             completed: true
    //         }, {
    //             description: 'Call Ashish',
    //             completed: false
    //         }
    //     ])
    //     console.log(result.ops)
    // } catch (error) {
    //     console.log(error)
    // }

    // Read
    // try {
    //     const result = await db.collection('tasks').findOne({ description: 'Call Ashish' })
    //     console.log(result)
    // } catch (error) {
    //     console.log(error)
    // }

    // Update
    // try {
    //     const result = await db.collection('tasks').updateMany({ completed: false }, { $set: { completed: true } })
    //     console.log(result.modifiedCount)
    // } catch (error) {
    //     console.log(error)
    // }

    // Delete
    // try {
    //     const result = await db.collection('tasks').deleteOne({ description: 'Call Ashish' })
    //     console.log(result.deletedCount)
    // } catch (error) {
    //     console.log(error)
    // }
})

