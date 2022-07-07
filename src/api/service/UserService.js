const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/User");
const Room = require('../models/Room');
const { toEvent, brodcastEvent, disconnectSocket, joinRoom, socketsEvent } = require('../helper/SocketUtils');
const { userModeling } = require('../helper/ModelUtils');
const {alreadyExistByEmail, checkPassword } = require('../validate/dbCheck');
const Report = require('../models/Report');

exports.singUpService = async (firstName, lastName, email, password) => {
    try {
        if (!await alreadyExistByEmail(email, 'sign_up_res')) {
            return console.log('wrong email sign in');
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password.toString(), salt);

        const newUser = userModeling(firstName, lastName, email, hash);
        await newUser.save()
        
        toEvent("sign_up_res", { status: true });
        return true;
    } catch (err) {
        err => toEvent("sign_up_res", { msg: "Error creating new user", status: false, error: err });
    }
}

exports.logInService = async (email, password) => {
    try {
        const userCheck = await alreadyExistByEmail(email, "log_in_res");
        if (!userCheck) {
            return console.log(" no log_in_res")
        }
        if (!checkPassword(password, userCheck.password, 'log_in_res')) {
            return console.log(" no log_in_res");
        }

        const docRef = await Room.find({ users: { $all: userCheck._id.toString() } });
        docRef.map((room) => joinRoom(room._id));

        toEvent("log_in_res", { status: true, user: userCheck, rooms: docRef });
        return console.log('log_in 4')
    } catch (err) {
        err => toEvent("log_in_res", { msg: "Error loging in", error: err, status: false });
    }
}

exports.deleteUserService = async (email, password) => {
    try {
        
        const userCheck = await alreadyExistByEmail(email, "delete_user_res");
        if (!userCheck) {
            return false
        };
        if (!checkPassword(password, userCheck.password, "delete_user_res")) {
            return false
        };
        
        const room = await Room.deleteMany({ users: { $all: [userCheck._id.toString() ]} });
        const report = await Report.deleteMany({ sender: { $all: userCheck._id.toString() }, receiver: { $all: userCheck._id.toString() } });
        const docRef = await User.findByIdAndDelete(userCheck._id, { password: 0 });

        socketsEvent("delete_user_res", { msg: "User deleted", users: docRef, status: true });
        return console.log('delete user');
    } catch (err) {
        err => toEvent("delete_user_res", { msg: "Error disconnecting", error: err, status: false });
    }
}

exports.logOutService = async () => {
    try {
        disconnectSocket(true);
    } catch (err) {
        err => toEvent("log_out_res", { msg: "Error disconnecting", error: err, status: false });
    }
}

exports.getUsersService = async (email, password, otherUser) => {
    try {
        const userCheck = await alreadyExistByEmail(email, "get_users_res");
        if (!userCheck) {
            return false
        };
        if (!checkPassword(password, userCheck.password, "get_users_res")) {
            return false
        };
        if (otherUser) {
            const docRef = await User.findById(otherUser, { password: 0 });
            return toEvent("get_users_res", { users: docRef, status: true });
        };

        const docRef = await User.find({}, { password: 0 });

        toEvent("get_users_res", { users: docRef, status: true });
        return console.log('get_user');
    } catch (err) {
        err => toEvent("get_users_res", { msg: "Error geting users", error: err, status: false })
    }
}

exports.onlineService = async (email, password, online) => {
    try {
        const userCheck = await alreadyExistByEmail(email, "online_res");
        if (!userCheck) {
            return false
        };
        if (!checkPassword(password, userCheck.password, "online_res")) {
            return false
        };

        const userOnline = await User.findByIdAndUpdate(userCheck._id, {online: online}, { new: true, password: 0 });
        
        socketsEvent("online_res", { user: userOnline, status: true });
        return console.log('online');
    } catch (err) {
        err => toEvent('online_res', { msg: "error changing to online", error: err, status: false });
    }
}