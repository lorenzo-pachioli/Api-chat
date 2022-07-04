const Room = require('../models/Room');
const User = require("../models/User");
const Message = require("../models/Message");
const { toEvent, brodcastEvent, disconnectSocket, joinRoom, socketsEvent, socketsInEvent } = require('../helper/SocketUtils');
const { ObjectId } = require('mongodb');

function wrongId(model) {
    return {
        msg: `Wrong ${model} id or ${model} doesn't exist`,
        status: false
    };
};

async function alreadyExist(_id, model, eventName) {
    const userCheck = await model.findById(_id);
    if (!userCheck) {
        toEvent(eventName, wrongId(`${model === User ? 'user' : 'room'}`));
        return false;
    }
    return userCheck;
};

async function roomExistByUsersId(_id, otherUser, eventName) {
    const roomCheck = await Room.findOne({ users: { $all: [_id.toString(), otherUser.toString()] } });
    console.log('roomCheck', roomCheck);
    if (!roomCheck) {
        return false;
    }
    return roomCheck;
};

module.exports.initRoomService = async (_id, otherUser) => {
    try {
        if (!alreadyExist(_id, User, "init_room_res")) {
            return false;
        };
        if (!alreadyExist(otherUser, User, "init_room_res")) {
            return false;
        };
        const roomCheck = await roomExistByUsersId(_id, otherUser, "init_room_res")

        if (roomCheck) {
            if (roomCheck.messages.length > 0) {
                readByService(_id, roomCheck._id);
            };
            joinRoom(roomCheck._id);
            toEvent("init_room_res", { msg: `Joined to room ${roomCheck[0]._id}`, room: docRef, status: true });
            return console.log(`Joined to room ${roomCheck._id}`);
        };
        const newRoom = Room({
            messages: [],
            users: [_id, otherUser]
        })
        const docRef = await newRoom.save();
        console.log('docRef', docRef)
        joinRoom(docRef._id);
        socketsInEvent(docRef._id, "init_room_res", { room: docRef, status: true });
        return console.log('room initiated');
    } catch (err) {
        err => toEvent("init_room_res", { msg: 'Error initiating room', error: err, status: false });
    }
}

module.exports.sendMessageService = async (_id, room_id, message) => {
    try {
        if (!alreadyExist(_id, User, "send_msg_res")) {
            return false;
        };
        const roomCheck = await alreadyExist(room_id, Room, "send_msg_res");
        if (!roomCheck) {
            return false;
        };
        const newMessage = Message({
            message: message,
            room: room_id,
            user: _id,
            readBy: [_id],
            time: new Date(Date.now())
        });
        const roomUpdate = await Room.findByIdAndUpdate(room_id, { $addToSet: { messages: newMessage } }, { new: true });
        socketsInEvent(room_id, "send_msg_res", { room: roomUpdate, newMessage: newMessage, status: true });
        return console.log(`msg sent to: ${roomUpdate._id}`);

    } catch (err) {
        err => toEvent("send_msg_res", { msg: "Error sending message", error: err, status: false });
    }
}

module.exports.readByService = async (_id, room_id) => {
    try {
        if (!alreadyExist(_id, User, "read_msg_res")) {
            return false;
        };
        if (!alreadyExist(room_id, Room, "read_msg_res")) {
            return false;
        };
        const docRef = await Room.findByIdAndUpdate(room_id, { $addToSet: { "messages.$[].readBy": _id } }, { new: true });
        socketsInEvent(room_id, "read_msg_res", { room: docRef, status: true });
        return console.log("read_msg_res", room_id);
    } catch (err) {
        err => toEvent("read_msg_res", { msg: "Error seting readBy", error: err, status: false });
    }
}

module.exports.deleteMsgService = async (_id, room_id, message_id) => {

    try {

        if (!alreadyExist(_id, User, "delete_msg_res")) {
            return false;
        };
        if (!alreadyExist(room_id, Room, "delete_msg_res")) {
            return false;
        };
        const newMsgId = new ObjectId(message_id)
        const updateDelete = {
            $pull: { messages: { _id: newMsgId } }
        };
        const docRef = await Room.findByIdAndUpdate(room_id, updateDelete, { new: true });
        socketsInEvent(room_id, "delete_msg_res", { room: docRef, status: true });
        return console.log('deleted', docRef._id);
    } catch (err) {
        err => toEvent("delete_msg_res", { msg: "Error deleting message", error: err, status: false });
    }
}

module.exports.deleteChatService = async (_id, room_id) => {
    try {
        if (!alreadyExist(_id, User, "delete_chat_res")) {
            return false;
        };
        if (!alreadyExist(room_id, Room, "delete_chat_res")) {
            return false;
        };
        const docRef = await Room.findByIdAndDelete(room_id, { new: true })
        socketsInEvent(room_id, "delete_chat_res", { room: docRef, status: true });
        return console.log(docRef)
    } catch (err) {
        err => toEvent("delete_chat_res", { msg: "Error deleting chat", error: err, status: false });
    }
}
