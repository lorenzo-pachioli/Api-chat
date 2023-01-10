const Room = require('../models/Room');
const { joinRoom } = require('../helper/SocketUtils');
const { ObjectId } = require('mongodb');
const { roomModeling, messageModeling } = require('../helper/ModelUtils');
const { alreadyExistById, roomExistByUsersId } = require('../validate/dbCheck');

exports.initRoomService = async (_id, otherUser) => {

	const newRoom = roomModeling(_id, otherUser);
	const roomSaved = await newRoom.save();
	this.joinRoomService(_id, roomSaved._id);
	return { room: roomSaved, otherUser, status: true };
}

exports.roomExistService = async (_id, otherUser) => {

	const roomCheck = await roomExistByUsersId(_id, otherUser);
	return roomCheck;
}

exports.roomExistByIdService = async (room_id) => {

	const roomExist = await alreadyExistById(room_id, Room);
	return roomExist;
}


exports.sendMessageService = async (_id, room_id, message) => {

	const newMessage = messageModeling(_id, room_id, message);
	const roomUpdate = await Room.findByIdAndUpdate(room_id, { $addToSet: { messages: newMessage } }, { new: true });
	return { room: roomUpdate, newMessage: newMessage, status: true };
}

exports.joinRoomService = async (_id, room) => {

	if (room.messages.length > 0) readByService(_id, room._id);
	joinRoom(room._id);
	return { room, status: true };
}

exports.readByService = async (_id, room_id) => {

	const docRef = await Room.findByIdAndUpdate(room_id, { $addToSet: { "messages.$[].readBy": _id } }, { new: true });
	return { room: docRef, status: true };
}

exports.deleteMsgService = async (_id, room_id, message_id) => {

	const roomUpdated = await Room.findByIdAndUpdate(room_id, { $pull: { messages: { _id: new ObjectId(message_id) } } }, { new: true });
	return { room: roomUpdated, status: true };
}

exports.deleteChatService = async (_id, room_id) => {

	const chatDeleted = await Room.findByIdAndDelete(room_id, { new: true });
	return { room: chatDeleted, status: true };
}
