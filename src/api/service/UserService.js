const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/User");
const Room = require('../models/Room');
const { toEvent, brodcastEvent, disconnectSocket, joinRoom, socketsEvent } = require('../helper/SocketUtils');
const { userModeling } = require('../helper/ModelUtils');
const { alreadyExistByEmail, checkPassword } = require('../validate/dbCheck');
const Report = require('../models/Report');

exports.singUpService = async (firstName, lastName, email, password) => {
    if (await alreadyExistByEmail(email)) throw new Error("Email used already has an account");

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password.toString(), salt);

    const newUser = userModeling(firstName, lastName, email, hash);
    await newUser.save();

    toEvent("sign_up_res", { status: true });
    return true;
}

exports.logInService = async (email, password) => {
    const userCheck = await alreadyExistByEmail(email);
    if (!userCheck) throw new Error("Email used doesn't exist");
    if (!checkPassword(password, userCheck.password)) throw new Error("Wrong password");

    const docRef = await Room.find({ users: { $all: userCheck._id.toString() } });
    if (docRef.length > 0) {
        docRef.map((room) => {
            joinRoom(room._id)
        });
    };

    toEvent("log_in_res", { status: true, user: userCheck, rooms: docRef });
}

exports.deleteUserService = async (email, password) => {
    const userCheck = await alreadyExistByEmail(email);
    if (!userCheck) throw new Error("Email used doesn't exist");
    if (!checkPassword(password, userCheck.password)) throw new Error("Wrong password");

    await Room.deleteMany({ users: { $all: [userCheck._id.toString()] } }, { new: true });
    await Report.deleteMany({ sender: { $all: userCheck._id.toString() }, receiver: { $all: userCheck._id.toString() } });
    const docRef = await User.findByIdAndDelete(userCheck._id, { password: 0 });
    const newRooms = await Room.find({ users: { $all: userCheck._id.toString() } });
    const newUserList = await User.find({}, { password: 0 });

    socketsEvent("delete_user_res", { msg: "User deleted", userDeleted: docRef, rooms: newRooms, users: newUserList, status: true });
}

exports.logOutService = async () => {
    disconnectSocket(true);
}

exports.getUsersService = async (email, password, otherUser) => {
    const userCheck = await alreadyExistByEmail(email);
    if (!userCheck) throw new Error("Email used doesn't exist");
    if (!checkPassword(password, userCheck.password)) throw new Error("Wrong password");
    if (otherUser) {
        const docRef = await User.findById(otherUser, { password: 0 });
        return toEvent("get_users_res", { users: docRef, status: true });
    };

    const docRef = await User.find({}, { password: 0 });

    toEvent("get_users_res", { users: docRef, status: true });
}

exports.onlineService = async (email, password, online) => {
    const userCheck = await alreadyExistByEmail(email);
    if (!userCheck) throw new Error("Email used doesn't exist");
    if (!checkPassword(password, userCheck.password)) throw new Error("Wrong password");

    const userOnline = await User.findByIdAndUpdate(userCheck._id, { online: online }, { new: true, password: 0 });

    socketsEvent("online_res", { user: userOnline, status: true });
}