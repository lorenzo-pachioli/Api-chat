const {Schema, model} = require('mongoose');
const Message = require('./Message');
const User = require('./User');

const roomSchema = new Schema({
    messages: [Message],
    users: [User] // o users:[User] pero sin password
})

const Room = model('Room', roomSchema)

module.exports = Room;