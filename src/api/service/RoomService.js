const Room = require('../models/Room');
const User = require("../models/User");
const { toEvent, brodcastEvent, disconnectSocket, joinRoom, socketsEvent, socketsInEvent } = require('../helper/SocketUtils');
const { ObjectId } = require('mongodb');
const { roomModeling, messageModeling } = require('../helper/ModelUtils');
const { alreadyExistById, roomExistByUsersId } = require('../validate/dbCheck');

exports.initRoomService = async (_id, otherUser) => {
    try {
        if (!await alreadyExistById(_id, User, "init_room_res")) {
            return false;
        };
        if (!await alreadyExistById(otherUser, User, "init_room_res")) {
            return false;
        };

        const roomCheck = await roomExistByUsersId(_id, otherUser);
        if (roomCheck) {
            if (roomCheck.messages.length > 0) {
                readByService(_id, roomCheck._id);
            };
            joinRoom(roomCheck._id);
            toEvent("init_room_res", { msg: `Joined to room ${roomCheck[0]._id}`, room: docRef, status: true });
            return console.log(`Joined to room ${roomCheck._id}`);
        };

        const newRoom = roomModeling(_id, otherUser);
        const docRef = await newRoom.save();
        joinRoom(docRef._id);
        socketsInEvent(docRef._id, "init_room_res", { room: docRef, status: true });
        return console.log('room initiated');
    } catch (err) {
        err => toEvent("init_room_res", { msg: 'Error initiating room', error: err, status: false });
    }
}

exports.sendMessageService = async (_id, room_id, message) => {
    try {
        if (!await alreadyExistById(_id, User, "send_msg_res")) {
            return false;
        };
        const roomCheck = await alreadyExistById(room_id, Room, "send_msg_res");
        if (!roomCheck) {
            return false;
        };

        const newMessage = messageModeling(_id, room_id, message);
        const roomUpdate = await Room.findByIdAndUpdate(room_id, { $addToSet: { messages: newMessage } }, { new: true });
        socketsInEvent(room_id, "send_msg_res", { room: roomUpdate, newMessage: newMessage, status: true });
        return console.log(`msg sent to: ${roomUpdate._id}`);
    } catch (err) {
        err => toEvent("send_msg_res", { msg: "Error sending message", error: err, status: false });
    }
}

exports.readByService = async (_id, room_id) => {
    try {
        if (!await alreadyExistById(_id, User, "read_msg_res")) {
            return false;
        };
        if (!await alreadyExistById(room_id, Room, "read_msg_res")) {
            return false;
        };
        const docRef = await Room.findByIdAndUpdate(room_id, { $addToSet: { "messages.$[].readBy": _id } }, { new: true });
        socketsInEvent(room_id, "read_msg_res", { room: docRef, status: true });
        return console.log("read_msg_res", room_id);
    } catch (err) {
        err => toEvent("read_msg_res", { msg: "Error seting readBy", error: err, status: false });
    }
}

exports.deleteMsgService = async (_id, room_id, message_id) => {
    try {
        if (!await alreadyExistById(_id, User, "delete_msg_res")) {
            return false;
        };
        if (!await alreadyExistById(room_id, Room, "delete_msg_res")) {
            return false;
        };

        const docRef = await Room.findByIdAndUpdate(room_id, { $pull: { messages: { _id: new ObjectId(message_id) } } }, { new: true });
        socketsInEvent(room_id, "delete_msg_res", { room: docRef, status: true });
        return console.log('deleted', docRef._id);
    } catch (err) {
        err => toEvent("delete_msg_res", { msg: "Error deleting message", error: err, status: false });
    }
}

exports.deleteChatService = async (_id, room_id) => {
    try {
        if (!await alreadyExistById(_id, User, "delete_chat_res")) {
            return false;
        };
        if (!await alreadyExistById(room_id, Room, "delete_chat_res")) {
            return false;
        };

        const docRef = await Room.findByIdAndDelete(room_id, { new: true })
        socketsInEvent(room_id, "delete_chat_res", { room: docRef, status: true });
        return console.log(docRef)
    } catch (err) {
        err => toEvent("delete_chat_res", { msg: "Error deleting chat", error: err, status: false });
    }
}
