const {
    initRoomService,
    sendMessageService,
    readByService,
    deleteMsgService,
    deleteChatService, 
    joinRoomService
} = require('../service/RoomService');
const { idValidate } = require('../validate/syntaxCheck');

exports.initRoom = (data) => {
    const { _id, otherUser } = data;

    if (!idValidate(_id, "init_room_res") || !idValidate(otherUser, "init_room_res")) {
        return false;
    };

    initRoomService(_id, otherUser);
};

exports.sendMessage = (data) => {
    const { _id, room, message } = data;

    if (!idValidate(_id, "send_msg_res") || !idValidate(room, "send_msg_res")) {
        return false;
    };

    sendMessageService(_id, room, message);
};
exports.joinRoom = (data) => {
    const { _id, room_id } = data;

    if (!idValidate(_id, "init_room_res") || !idValidate(room_id, "init_room_res")) {
        return false;
    };
    
    joinRoomService(_id, room_id);
}

exports.readBy = (data) => {
    const { _id, room_id } = data;

    if (!idValidate(_id, "read_msg_res") || !idValidate(room_id, "read_msg_res")) {
        return false;
    };

    readByService(_id, room_id);
};

exports.deleteMsg = (data) => {
    const { _id, room_id, message_id } = data;

    if (!idValidate(_id, "delete_msg_res") || !idValidate(room_id, "delete_msg_res") || !idValidate(message_id, "delete_msg_res")) {
        return false;
    };

    deleteMsgService(_id, room_id, message_id);
};

exports.deleteChat = (data) => {
    const { _id, room_id } = data;

    if (!idValidate(_id, "read_msg_res") || !idValidate(room_id, "read_msg_res")) {
        return false;
    };

    deleteChatService(_id, room_id);
};
