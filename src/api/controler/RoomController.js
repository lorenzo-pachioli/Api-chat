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

    idValidate(_id, "init_room_res");
    idValidate(otherUser, "init_room_res");

    await initRoomService(_id, otherUser);
};

exports.sendMessage = async (data) => {
    const { _id, room, message } = data;

    idValidate(_id, "send_msg_res");
    idValidate(room, "send_msg_res");

    await sendMessageService(_id, room, message);
};

exports.joinRoom = async (data) => {
    const { _id, room_id } = data;

    idValidate(_id, "init_room_res");
    idValidate(room_id, "init_room_res");

    await joinRoomService(_id, room_id);
}

exports.readBy = async (data) => {
    const { _id, room_id } = data;

    idValidate(_id, "read_msg_res");
    idValidate(room_id, "read_msg_res");

    await readByService(_id, room_id);
};

exports.deleteMsg = async (data) => {
    const { _id, room_id, message_id } = data;

    idValidate(_id, "delete_msg_res");
    idValidate(room_id, "delete_msg_res");
    idValidate(message_id, "delete_msg_res");

    await deleteMsgService(_id, room_id, message_id);
};

exports.deleteChat = async (data) => {
    const { _id, room_id } = data;

    idValidate(_id, "read_msg_res");
    idValidate(room_id, "read_msg_res");

    await deleteChatService(_id, room_id);
};
