require('./config/mongoDB');

const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const { Server } = require('socket.io');
const {api} = require('./api/index');
const {toEvent} = require('./api/helper/SocketUtils');
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
console.log('1');
io.on("connect", (socket) => {
    api(io, socket)
    console.log('2');
});


process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason );
    toEvent(`log_in_res`, { msg: `Unhandled Rejection at: ${reason}`, status: false });
});

process.on('uncaughtException', (err, origin) => {
    console.log(`Caught exception: ${err}`, ` origin: ${ origin}`);
    toEvent(`log_in_res`, { msg: `Caught exception: ${err}`, status: false });
});

const port = process.env.PORT || 3001;
server.listen(port, (error) => {
    console.log('Connected');
})
