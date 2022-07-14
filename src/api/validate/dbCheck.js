const Room = require('../models/Room');
const User = require('../models/User');
const bcrypt = require('bcrypt');

async function alreadyExistByEmail(email) {
    const userCheck = await User.findOne({ email: email });
    if (userCheck) return userCheck;
    return false;
};

async function alreadyExistById(_id, model) {
    const userCheck = await model.findById(_id);
    if (userCheck) return userCheck;
    return false;
};

function checkPassword(password, hashPassword) {
    if (bcrypt.compareSync(password, hashPassword)) return true;
    return false;
};

async function roomExistByUsersId(_id, otherUser) {
    const roomCheck = await Room.findOne({ users: { $all: [_id.toString(), otherUser.toString()] } });
    if (!roomCheck) return roomCheck;
    return false;
};

module.exports = {
    alreadyExistByEmail, 
    alreadyExistById,
    checkPassword,
    roomExistByUsersId
};
