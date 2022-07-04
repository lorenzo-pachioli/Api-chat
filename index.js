require('./config/mongoDB');

const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const { Server } = require('socket.io');
const { initComplaint, getComplains } = require('./api/service/ComplainsController');
const { userRoute } = require('./api/routes/UserRoute');
const { initSocket } = require('./api/helper/SocketUtils');
const { RoomRoute } = require('./api/routes/RoomRoute');

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connect", (socket) => {
    initSocket(io, socket);
    userRoute(socket);
    RoomRoute(socket);
    
    //Complains controller
    socket.on("init_complain", data => initComplaint(data, io, socket));
    socket.on("get_complains", data => getComplains(data, io, socket.id));
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log('Connected');
})
