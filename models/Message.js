const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    message: String,
    id: Number,
    room: Number,
    username: String,
    time: String
})

const Message = model('Message', messageSchema)

module.exports = Message;