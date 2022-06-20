const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    message: String,
    room: String,
    user: String,
    readBy:[String],
    time: Date
})

const Message = model('Message', messageSchema)

module.exports = Message;