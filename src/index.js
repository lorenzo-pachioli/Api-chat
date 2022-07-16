require('./config/mongoDB');

const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const { Server } = require('socket.io');
const {api} = require('./api/index');
const {userValidationMiddleware, roomValidationMiddleware} = require('./api/middleware/inputValidation');
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

/* io.use((socket, next) => {
    console.log(socket);
    next();
}); */

io.on("connect", (socket) => {
    userValidationMiddleware(socket);
    roomValidationMiddleware(socket);
    api(io, socket);
});

const port = process.env.PORT || 3001;
server.listen(port, (error) => {
    console.log('Connected');
})
