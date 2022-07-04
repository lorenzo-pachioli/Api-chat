const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/User");
const Room = require('../models/Room')
const { toEvent, brodcastEvent, disconnectSocket, joinRoom, socketsEvent } = require('../helper/SocketUtils')
const wrongEmail = {
    msg: "Wrong email ",
    status: false
}
const wrongPassword = {
    msg: "Wrong password ",
    status: false
}

async function alreadyExist(email, eventName) {
    const userCheck = await User.findOne({ email: email });
    if (!userCheck) {
        toEvent(eventName, wrongEmail)
        return false;
    }
    return userCheck;
}

function checkPassword(password, hashPassword, eventName) {
    if (!bcrypt.compareSync(password, hashPassword)) {
        toEvent(eventName, wrongPassword)
        return false
    }
    return true;
}

module.exports.singUpService = async (firstName, lastName, email, password) => {
    try {
        if (!alreadyExist(email, 'sign_up_res')) {
            return false;
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password.toString(), salt);
        const newUser = User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash,
            online: false
        });
        await newUser.save()
        return toEvent("sign_up_res", { status: true })
    } catch (err) {
        err => toEvent("sign_up_res", { msg: "Error creating new user", status: false, error: err });
    }
}

module.exports.logInService = async (email, password) => {
    try {
        const userCheck = await alreadyExist(email, "log_in_res");

        if (!userCheck) {
            return console.log(" no log_in_res")
        }
        if (!checkPassword(password, userCheck.password, 'log_in_res')) {
            return console.log(" no log_in_res");
        }

        const docRef = await Room.find({ users: { $all: userCheck._id.toString() } });
        docRef.map((room) => joinRoom(room._id));

        toEvent("log_in_res", { status: true, user: userCheck, rooms: docRef });
        return console.log('log_in')

    } catch (err) {
        err => toEvent("log_in_res", { msg: "Error loging in", error: err, status: false });
    }
}

module.exports.deleteUserService = async (email, password) => {
    try {
        const userCheck = await alreadyExist(email, "delete_user_res");
        if (!userCheck) {
            return false
        }
        if (!checkPassword(password, userCheck.password, "delete_user_res")) {
            return false
        }

        const docRef = await User.findByIdAndDelete(userCheck._id, { password: 0 });
        console.log('delete', docRef);
        socketsEvent("delete_user_res", { msg: "User deleted", users: docRef, status: true });
        return console.log('delete user')

    } catch (err) {
        err => toEvent("delete_user_res", { msg: "Error disconnecting", error: err, status: false });
    }
}

module.exports.logOutService = async () => {
    try {
        disconnectSocket(true);
    } catch (err) {
        err => toEvent("log_out_res", { msg: "Error disconnecting", error: err, status: false });
    }
}

module.exports.getUsersService = async (email, password, otherUser) => {
    try {
        const userCheck = await alreadyExist(email, "get_users_res");
        if (!userCheck) {
            return false
        };
        if (!checkPassword(password, userCheck.password, "get_users_res")) {
            return false
        };
        if (otherUser) {
            const docRef = await User.findById(otherUser, { password: 0 });
            return toEvent("get_users_res", {
                users: {
                    _id: docRef._id,
                    firstName: docRef.firstName,
                    lastName: docRef.lastName,
                    email: docRef.email,
                    online: docRef.online
                },
                status: true
            });
        };
        const docRef = await User.find({}, { password: 0 });
        toEvent("get_users_res", { users: docRef, status: true });
        return console.log('get_user');
    } catch (err) {
        err => toEvent("get_users_res", { msg: "Error geting users", error: err, status: false })
    }
}

module.exports.onlineService = async (email, password, online) => {
    try {
        const userCheck = await alreadyExist(email, "online_res");
        if (!userCheck) {
            return false
        }
        if (!checkPassword(password, userCheck.password, "online_res")) {
            return false
        }
        const update = {
            online: online
        }
        const userOnline = await User.findByIdAndUpdate(userCheck._id, update, { new: true, password: 0 });
        socketsEvent("online_res", { user: userOnline, status: true });
        return console.log('online');
    } catch (err) {
        err => toEvent('online_res', { msg: "error changing to online", error: err, status: false });
    }
}