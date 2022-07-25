const Room = require('../models/Room');
const User = require("../models/User");
const { toEvent, joinRoom, socketsEvent, socketsInEvent } = require('../helper/SocketUtils');
const { ObjectId } = require('mongodb');
const { roomModeling, messageModeling } = require('../helper/ModelUtils');
const { alreadyExistById, roomExistByUsersId } = require('../validate/dbCheck');

exports.initRoomService = async (_id, otherUser) => {
	if (!await alreadyExistById(_id, User)) throw new Error("Must be registered to init chat");
	if (!await alreadyExistById(otherUser, User)) throw new Error("The user you want to initiate a chat with doesn't exist");
	const roomCheck = await roomExistByUsersId(_id, otherUser);

	if (roomCheck) {
		if (roomCheck.messages.length > 0) {
			readByService(_id, roomCheck._id);
		};
		joinRoom(roomCheck._id);
		toEvent("init_room_res", { room: docRef, status: true });
		return console.log(`Joined to room ${roomCheck._id}`);
	};
	const newRoom = roomModeling(_id, otherUser);
	const docRef = await newRoom.save();
	joinRoom(docRef._id);

	socketsEvent("init_room_res", { room: docRef, otherUser: otherUser, status: true });
}

exports.sendMessageService = async (_id, room_id, message) => {
	if (!await alreadyExistById(_id, User)) throw new Error("Must be registered to send a message");
	if (!await alreadyExistById(room_id, Room)) throw new Error("The chat you're sending a message doesn't exist");

	const newMessage = messageModeling(_id, room_id, message);
	const roomUpdate = await Room.findByIdAndUpdate(room_id, { $addToSet: { messages: newMessage } }, { new: true });

	socketsInEvent(room_id, "send_msg_res", { room: roomUpdate, newMessage: newMessage, status: true });
}

exports.joinRoomService = async (_id, room_id) => {
	if (!await alreadyExistById(_id, User)) throw new Error("Must be registered to join chat");
	if (!await alreadyExistById(room_id, Room)) throw new Error("The chat you're joining doesn't exist");

	joinRoom(room_id);
}

exports.readByService = async (_id, room_id) => {
	if (!await alreadyExistById(_id, User)) throw new Error("Must be registered to set messages as read");
	if (!await alreadyExistById(room_id, Room)) throw new Error("The chat you want to mark as read doesn't exist");

	const docRef = await Room.findByIdAndUpdate(room_id, { $addToSet: { "messages.$[].readBy": _id } }, { new: true });

	socketsInEvent(room_id, "read_msg_res", { room: docRef, status: true });
}

exports.deleteMsgService = async (_id, room_id, message_id) => {
	if (!await alreadyExistById(_id, User)) throw new Error("Must be registered to delete messages");
	if (!await alreadyExistById(room_id, Room)) throw new Error("The chat you want to delete messages from doesn't exist");

	const docRef = await Room.findByIdAndUpdate(room_id, { $pull: { messages: { _id: new ObjectId(message_id) } } }, { new: true });

	socketsInEvent(room_id, "delete_msg_res", { room: docRef, status: true });
}

exports.deleteChatService = async (_id, room_id) => {
	if (!await alreadyExistById(_id, User)) throw new Error("Must be registered to delete a chat");
	if (!await alreadyExistById(room_id, Room)) throw new Error("The chat you want to delete doesn't exist");

	const docRef = await Room.findByIdAndDelete(room_id, { new: true });

	socketsInEvent(room_id, "delete_chat_res", { room: docRef, status: true });
}
