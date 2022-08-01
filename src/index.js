require('./config/mongoDB');

const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const { Server } = require('socket.io');
const { api } = require('./api/index');
const { toEvent } = require('./api/helper/SocketUtils');
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connect", (socket) => {
    api(io, socket);
});


process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection at:', err );
    toEvent('', { msg: `Unhandled Rejection: ${err}`, status: false });
});

process.on('uncaughtException', (err, origin) => {
    console.log(`Caught exception: ${err}`, ` origin: ${origin}`);
    toEvent('', { msg: `Caught exception: ${err}`, at: origin, status: false });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log('Connected');
})
