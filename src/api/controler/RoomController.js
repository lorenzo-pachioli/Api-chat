const {
    initRoomService, 
    sendMessageService, 
    readByService, 
    deleteMsgService, 
    deleteChatService
} = require('../service/RoomService');

exports.initRoom = (data) => {
    const {_id, otherUser} = data;
    initRoomService(_id, otherUser);
};

exports.sendMessage = (data) => {
    const {_id, room, message} = data;
    sendMessageService(_id, room, message);
};

exports.readBy = (data) => {
    const {_id, room_id} = data;
    readByService(_id, room_id);
};

exports.deleteMsg = (data) => {
    const {_id,room_id, message_id} = data;
    deleteMsgService(_id,room_id, message_id);
};

exports.deleteChat = (data) => {
    const {_id,room_id} = data;
    deleteChatService(_id,room_id);
};
