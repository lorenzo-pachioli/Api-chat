require('./config/mongoDB');

const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const { Server } = require('socket.io');
const {api} = require('./api/index');
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connect", (socket) => {
    api(io, socket)
});

const port = process.env.PORT || 3001;
server.listen(port, (error) => {
    console.log('Connected');
})
