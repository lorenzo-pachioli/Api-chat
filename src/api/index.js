const { initSocket } = require('./helper/SocketUtils');
const { userRoute } = require('./routes/UserRoute');
const { roomRoute } = require('./routes/RoomRoute');
const { reportChatRoute } = require('./routes/ReportChatRoute');

exports.api = (io, socket) => {
    initSocket(io, socket);
    userRoute(socket);
    roomRoute(socket);
    reportChatRoute(socket);
    return true;
}