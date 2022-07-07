const {Schema, model} = require('mongoose');

const reportSchema = new Schema({
    complain: String,
    sender: String,
    receiver: String,
    chat: String,
    url: String
})

const Report = model('Report', reportSchema);

module.exports = Report;