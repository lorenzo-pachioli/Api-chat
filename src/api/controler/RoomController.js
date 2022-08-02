const {
    initRoomService,
    sendMessageService,
    readByService,
    deleteMsgService,
    deleteChatService,
    joinRoomService
} = require('../service/RoomService');
const { idValidate } = require('../validate/syntaxCheck');

exports.initRoom = async (data) => {
    const { _id, otherUser } = data;

    if (!idValidate(_id, "init_room_res") ||
        !idValidate(otherUser, "init_room_res")) {
        throw new Error("Incorrect id form");
    }

    await initRoomService(_id, otherUser);
};

exports.sendMessage = async (data) => {
    const { _id, room, message } = data;

    if (!idValidate(_id, "send_msg_res") ||
        !idValidate(room, "send_msg_res")) {
        throw new Error("Incorrect id form");
    }

    await sendMessageService(_id, room, message);
};

exports.joinRoom = async (data) => {
    const { _id, room_id } = data;

    if (!idValidate(_id, "init_room_res") ||
        !idValidate(room_id, "init_room_res")) {
        throw new Error("Incorrect id form");
    }

    await joinRoomService(_id, room_id);
}

exports.readBy = async (data) => {
    const { _id, room_id } = data;

    if (!idValidate(_id, "read_msg_res") ||
        !idValidate(room_id, "read_msg_res")) {
        throw new Error("Incorrect id form");
    }

    await readByService(_id, room_id);
};

exports.deleteMsg = async (data) => {
    const { _id, room_id, message_id } = data;

    if (!idValidate(_id, "delete_msg_res") ||
        !idValidate(room_id, "delete_msg_res") ||
        !idValidate(message_id, "delete_msg_res")) {
        throw new Error("Incorrect id form");
    }

    await deleteMsgService(_id, room_id, message_id);
};

exports.deleteChat = async (data) => {
    const { _id, room_id } = data;

    if (!idValidate(_id, "read_msg_res") ||
        !idValidate(room_id, "read_msg_res")) {
        throw new Error("Incorrect id form");    
    }

    await deleteChatService(_id, room_id);
};
