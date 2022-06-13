const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    type: String,
    email: String,
    password: Number
})

const User = model('Message', userSchema)

module.exports = User;

