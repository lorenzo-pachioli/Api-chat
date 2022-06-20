require('./mongoDB');

const express = require('express')
const app = express()
const http = require('http')
const cors = require("cors")
const {Server} = require('socket.io')
const Message = require('./models/Message');
const {
    signUp,
    logIn,
    logOut, 
    deleteUser,
    getUsers 
} = require('./Controllers/userController');
const {initRoom, sendMessage, readBy, deleteMsg, deleteChat} = require('./Controllers/roomController');

app.use(express.json())
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000" 
    }
})

io.on("connect", (socket)=> {
    console.log('id', socket.id)

    //User controller
    socket.on("sign_up", (data) => signUp(data, io, socket.id));
    socket.on("log_in", data => logIn(data,io, socket));
    socket.on("log_out", () => logOut(io, socket));
    socket.on("delete_user", data => deleteUser(data,io, socket));
    socket.on("get_users", data=> getUsers(data, io, socket.id));

    //Room controller
    socket.once("init_room", data=> initRoom(data, io, socket));
    socket.once("send_msg", data=> sendMessage(data, io, socket.id));
    socket.once("read_msg", data=> readBy(data, io, socket.id));
    socket.once("delete_msg", data=> deleteMsg(data, io, socket.id));
    socket.once("delete_chat", data=> deleteChat(data, io, socket.id));

    socket.on("disconnect", ()=>{
        console.log('disconnected', socket.id)
    })
})

const port = process.env.PORT || 3001
server.listen(port, ()=>{
    console.log('Connected')
})

