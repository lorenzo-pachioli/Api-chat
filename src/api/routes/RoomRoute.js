const {
    initRoom,
    sendMessage,
    readBy,
    deleteMsg,
    deleteChat
} = require('../controler/RoomController');

exports.roomRoute = (socket) => {
    socket.on("init_room", data => initRoom(data));
    socket.on("send_msg", data => sendMessage(data));
    socket.on("read_msg", data => readBy(data));
    socket.on("delete_msg", data => deleteMsg(data));
    socket.on("delete_chat", data => deleteChat(data));
};