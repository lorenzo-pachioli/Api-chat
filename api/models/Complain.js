const {Schema, model} = require('mongoose');

const complainSchema = new Schema({
    complain: String,
    sender: String,
    receiver: String,
    chat: String,
    url: String
})

const Complain = model('Complain', complainSchema);

module.exports = Complain;