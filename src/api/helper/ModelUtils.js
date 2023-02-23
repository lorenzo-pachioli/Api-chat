const Report = require('../models/Report');
const Room = require('../models/Room');
const User = require('../models/User');
const Message = require('../models/Message');

exports.userModeling = (firstName, lastName, email, hash, online = false) => {
    if (!firstName || !lastName || !email || !hash) return false;
    const newUser = User({
        firstName,
        lastName,
        email,
        password: hash,
        online
    });
    return newUser;
}

exports.roomModeling = (_id, otherUser) => {
    if (!_id || !otherUser) return false;
    const newRoom = Room({
        messages: [],
        users: [_id, otherUser]
    });
    return newRoom;
}

exports.messageModeling = (_id, room_id, message) => {
    if (!_id || !room_id || !message) return false;
    const newMessage = Message({
        message: message,
        room: room_id,
        user: _id,
        readBy: [_id],
        time: new Date(Date.now())
    });
    return newMessage;
}

exports.reportModeling = (sender, receiver, room_id, complain, url) => {
    if (!sender || !receiver || !room_id || !complain || !url) return false;
    const newReport = Report({
        complain: complain,
        sender: sender,
        receiver: receiver,
        chat: room_id,
        url: url
    });
    return newReport;
}
