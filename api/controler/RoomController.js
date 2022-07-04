const {
    initRoomService, 
    sendMessageService, 
    readByService, 
    deleteMsgService, 
    deleteChatService
} = require('../service/RoomService');

module.exports.initRoom = (data) => {
    const {_id, otherUser} = data;
    initRoomService(_id, otherUser);
};

module.exports.sendMessage = (data) => {
    const {_id, room, message} = data;
    sendMessageService(_id, room, message);
};

module.exports.readBy = (data) => {
    const {_id, room_id} = data;
    readByService(_id, room_id);
};

module.exports.deleteMsg = (data) => {
    const {_id,room_id, message_id} = data;
    deleteMsgService(_id,room_id, message_id);
};

module.exports.deleteChat = (data) => {
    const {_id,room_id} = data;
    deleteChatService(_id,room_id);
};
