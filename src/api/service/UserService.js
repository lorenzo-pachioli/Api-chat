const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/User");
const Room = require('../models/Room');
const { disconnectSocket, joinRoom } = require('../helper/SocketUtils');
const { userModeling } = require('../helper/ModelUtils');
const { alreadyExistByEmail, alreadyExistById } = require('../validate/dbCheck');
const Report = require('../models/Report');

exports.singUpService = async (firstName, lastName, email, password) => {

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password.toString(), salt);
    const newUser = userModeling(firstName, lastName, email, hash);
    await newUser.save();
    return { status: true };
}

exports.logInService = async (_id) => {

    const docRef = await Room.find({ users: { $all: _id.toString() } });
    if (docRef.length > 0) {
        docRef.map((room) => {
            joinRoom(room._id)
        });
    };
    return { status: true, rooms: docRef };
}

exports.deleteUserService = async (_id) => {

    await Room.deleteMany({ users: { $all: [_id.toString()] } });
    await Report.deleteMany({ sender: { $all: _id.toString() }, receiver: { $all: _id.toString() } });

    const docRef = await User.findByIdAndDelete(_id, { password: 0 });
    const newRooms = await Room.find({ users: { $all: _id.toString() } });
    const newUserList = await User.find({}, { password: 0 });
    return { msg: "User deleted", userDeleted: docRef, rooms: newRooms, users: newUserList, status: true };
}

exports.logOutService = async () => {
    disconnectSocket(true);
}

exports.updateUserService = async (user) => {

    if (user.password && user.password.length <= 15) {
        const salt = bcrypt.genSaltSync(saltRounds);
        user.password = bcrypt.hashSync(user.password.toString(), salt);
    }
    const userUpdated = await User.findOneAndUpdate({ _id: user._id }, user, { new: true });
    return { userUpdated, status: true };
}

exports.getUsersService = async (otherUser) => {

    if (otherUser) {
        const docRef = await User.findById(otherUser, { password: 0 });
        return { users: docRef, status: true };
    };
    const docRef = await User.find({}, { password: 0 });
    return { users: docRef, status: true };
}

exports.onlineService = async (_id, online) => {

    const userOnline = await User.findByIdAndUpdate(_id, { online: online }, { new: true, password: 0 });
    return { user: userOnline, status: true };
}

exports.userExistService = async (_id) => {

    const user = await alreadyExistById(_id, User);
    if (!user) return false;
    return user;
}

exports.userExistByEmailService = async (email) => {

    const user = await alreadyExistByEmail(email);
    if (!user) return false;
    return user;
}