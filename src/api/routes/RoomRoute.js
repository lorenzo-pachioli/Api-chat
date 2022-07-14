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
    socket.on("init_room", data => errorCatch(initRoom(data)));
    socket.on("send_msg", data => errorCatch(sendMessage(data)));
    socket.on("join_room", data => errorCatch(joinRoom(data)));
    socket.on("read_msg", data => errorCatch(readBy(data)));
    socket.on("delete_msg", data => errorCatch(deleteMsg(data)));
    socket.on("delete_chat", data => errorCatch(deleteChat(data)));
};