require('./config/mongoDB');

const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const { Server } = require('socket.io');
const { online } = require('./api/controler/UserController');
const { initRoom, sendMessage, readBy, deleteMsg, deleteChat } = require('./api/service/roomController');
const { initComplaint, getComplains } = require('./api/service/ComplainsController');
const { userRoute } = require('./api/routes/UserRoute');
const { initSocket } = require('./api/helper/SocketUtils');

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connect", (socket) => {
    userRoute(socket);
    initSocket(io, socket);

    //Room controller
    socket.on("init_room", data => initRoom(data, io, socket));
    socket.on("send_msg", data => sendMessage(data, io, socket.id));
    socket.on("read_msg", data => readBy(data, io, socket.id));
    socket.on("delete_msg", data => deleteMsg(data, io, socket.id));
    socket.on("delete_chat", data => deleteChat(data, io, socket.id));

    //Complains controller
    socket.on("init_complain", data => initComplaint(data, io, socket));
    socket.on("get_complains", data => getComplains(data, io, socket.id));
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log('Connected');
})
