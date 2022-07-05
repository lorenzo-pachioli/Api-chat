const Room = require('../models/Room');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {toEvent} = require('../helper/SocketUtils');

const wrongEmail = {
    msg: "Wrong email ",
    status: false
};

const wrongPassword = {
    msg: "Wrong password ",
    status: false
};

function wrongId(model) {
    return {
        msg: `Wrong ${model} id or ${model} doesn't exist`,
        status: false
    };
};

async function alreadyExistByEmail(email, eventName) {
    const userCheck = await User.findOne({ email: email });
    if (!userCheck) {
        toEvent(eventName, wrongEmail);
        return false;
    };
    return userCheck;
}

async function alreadyExistById(_id, model, eventName) {
    const userCheck = await model.findById(_id);
    if (!userCheck) {
        toEvent(eventName, wrongId(`${model === User ? 'user' : 'room'}`));
        return false;
    };
    return userCheck;
};

function checkPassword(password, hashPassword, eventName) {
    if (!bcrypt.compareSync(password, hashPassword)) {
        toEvent(eventName, wrongPassword);
        return false;
    };
    return true;
};

async function roomExistByUsersId(_id, otherUser) {
    const roomCheck = await Room.findOne({ users: { $all: [_id.toString(), otherUser.toString()] } });
    if (!roomCheck) {
        return false;
    };
    return roomCheck;
};

module.exports = {
    alreadyExistByEmail, 
    alreadyExistById,
    checkPassword,
    roomExistByUsersId
};
