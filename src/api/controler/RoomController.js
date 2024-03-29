const { socketsEvent, socketsInEvent, toEvent } = require('../helper/SocketUtils');
const {
    initRoomService,
    sendMessageService,
    readByService,
    deleteMsgService,
    deleteChatService,
    joinRoomService,
    roomExistService,
    roomExistByIdService
} = require('../service/RoomService');
const { userExistService } = require('../service/UserService');
const { idValidate } = require('../validate/syntaxCheck');

exports.initRoom = async (data) => {
    const { _id, otherUser } = data;

    if (!idValidate(_id)) throw new Error("Incorrect user id form");
    if (!idValidate(otherUser)) throw new Error("Incorrect otherUser id form");

    if (!await userExistService(_id)) throw new Error("Must be registered to init chat");
    if (!await userExistService(otherUser)) throw new Error("The user you want to initiate a chat with doesn't exist");

    const roomCheck = await roomExistService(_id, otherUser);
    console.log(roomCheck);
    if (roomCheck.length > 0) {
        if (roomCheck[0].messages.length > 0) {
            await readByService(_id, roomCheck[0]._id);
        };
        await joinRoomService(roomCheck[0]._id);
        toEvent("init_room_res", { room: roomCheck[0], status: true });
        return console.log(`Joined to room ${roomCheck[0]._id}`);
    };

    const roomCreated = await initRoomService(_id, otherUser);
    socketsEvent("init_room_res", roomCreated);
};

exports.sendMessage = async (data) => {
    const { _id, room, message } = data;
    const room_id = room;

    if (!idValidate(_id)) throw new Error("Incorrect user id form");
    if (!idValidate(room_id)) throw new Error("Incorrect room id form");

    if (!await userExistService(_id)) throw new Error("Must be registered to send a message");
    if (!await roomExistByIdService(room_id)) throw new Error("The chat you're sending a message doesn't exist");

    const messageSent = await sendMessageService(_id, room_id, message);
    socketsInEvent(room_id, "send_msg_res", messageSent);
};

exports.joinRoom = async (data) => {
    const { _id, room_id } = data;

    if (!idValidate(_id)) throw new Error("Incorrect user id form");
    if (!idValidate(room_id)) throw new Error("Incorrect room id form");

    await joinRoomService(_id, room_id);
}

exports.readBy = async (data) => {
    const { _id, room_id } = data;

    if (!idValidate(_id)) throw new Error("Incorrect user id form");
    if (!idValidate(room_id)) throw new Error("Incorrect room id form");

    if (!await userExistService(_id)) throw new Error("Must be registered to set messages as read");
    if (!await roomExistByIdService(room_id)) throw new Error("The chat you want to mark as read doesn't exist");

    const markedRead = await readByService(_id, room_id)
    socketsInEvent(room_id, "read_msg_res", markedRead);
};

exports.deleteMsg = async (data) => {
    const { _id, room_id, message_id } = data;

    if (!idValidate(_id)) throw new Error("Incorrect user id form");
    if (!idValidate(room_id)) throw new Error("Incorrect room id form");
    if (!idValidate(message_id)) throw new Error("Incorrect message id form");

    if (!await userExistService(_id)) throw new Error("Must be registered to delete messages");
    if (!await roomExistByIdService(room_id)) throw new Error("The chat you want to delete messages from doesn't exist");

    const msgDeleted = await deleteMsgService(_id, room_id, message_id);
    socketsInEvent(room_id, "delete_msg_res", msgDeleted);
};

exports.deleteChat = async (data) => {
    const { _id, room_id } = data;

    if (!idValidate(_id)) throw new Error("Incorrect user id form");
    if (!idValidate(room_id)) throw new Error("Incorrect room id form");

    if (!await userExistService(_id)) throw new Error("Must be registered to delete a chat");
    if (!await roomExistByIdService(room_id)) throw new Error("The chat you want to delete doesn't exist");

    const chatDeleted = await deleteChatService(_id, room_id);
    socketsInEvent(room_id, "delete_chat_res", chatDeleted);
};
