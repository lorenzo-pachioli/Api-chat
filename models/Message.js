const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    message: String,
    room: String,
    user: Object,
    time: String
})

const Message = model('Message', messageSchema)

module.exports = Message;