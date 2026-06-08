require('./config/mongoDB');

const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const healthCheckRoutes = require('./api/routes/HealthCheckRoutes');
const authRoutes = require('./api/routes/AuthRoutes');
const { Server } = require('socket.io');
const { api } = require('./api/index');
const { toEvent } = require('./api/helper/SocketUtils');
const { returnError } = require('./api/helper/response');

app.use(express.json());
app.use(cors());

const server = http.createServer(app);


app.get('/health', healthCheckRoutes);
app.use('/auth', authRoutes);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connect", (socket) => {
    api(io, socket);
});


process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection at:', err);
    toEvent('', { msg: `Unhandled Rejection: ${err}`, status: false });
});

process.on('uncaughtException', (err, origin) => {
    console.log(`Caught exception: ${err}`, ` origin: ${origin}`);
    toEvent('', { msg: `Caught exception: ${err}`, at: origin, status: false });
});

app.use(returnError);

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log('Connected');
    console.log("Port: ", port);
})
