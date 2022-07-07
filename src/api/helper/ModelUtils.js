const Report = require('../models/Report');
const Room = require('../models/Room');
const User = require('../models/User');
const Message = require('../models/Message');

exports.userModeling = (firstName, lastName, email, hash) => {
    const newUser = User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hash,
        online: false
    });
    return newUser;
}

exports.roomModeling = (_id, otherUser) => {
    const newRoom = Room({
        messages: [],
        users: [_id, otherUser]
    });
    return newRoom;
}

exports.messageModeling = (_id, room_id, message) => {
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
    const newReport = Report({
        complain: complain,
        sender: sender,
        receiver: receiver,
        chat: room_id,
        url: url
    });
    return newReport;
}
