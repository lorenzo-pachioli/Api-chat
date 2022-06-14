const {Schema, model} = require('mongoose');

const roomSchema = new Schema({
    messages: Array,
    users: Array
})

const Room = model('Room', roomSchema)

module.exports = Room;