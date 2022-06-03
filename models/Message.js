const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    message: String,
    id: Number,
    room: Number,
    author: String,
    date: Date
})

const Message = model('Note', messageSchema)

module.exports = Message;