const {
    initRoom,
    sendMessage,
    readBy,
    deleteMsg,
    deleteChat,
    joinRoom
} = require('../controler/RoomController');
const { errorCatch } = require('../helper/ErrorsUtils');

exports.roomRoute = (socket) => {
    socket.on("init_room", data => errorCatch(initRoom(data), "init_room"));
    socket.on("send_msg", data => errorCatch(sendMessage(data), "send_msg"));
    socket.on("join_room", data => errorCatch(joinRoom(data), "join_room"));
    socket.on("read_msg", data => errorCatch(readBy(data), "read_msg"));
    socket.on("delete_msg", data => errorCatch(deleteMsg(data), "delete_msg"));
    socket.on("delete_chat", data => errorCatch(deleteChat(data), "delete_chat"));
};