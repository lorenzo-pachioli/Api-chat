
require('./mongoDB');

const express = require('express')
const app = express()
const http = require('http')
const cors = require("cors")
const {Server} = require('socket.io')
const {signUp,logIn,logOut, deleteUser,getUsers,online } = require('./Controllers/userController');
const {initRoom, sendMessage, readBy, deleteMsg, deleteChat} = require('./Controllers/roomController');

app.use(express.json())
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin:"*" 
    }
})


io.on("connect", (socket)=> {
    console.log('id', socket.id)
    let user={};

    //User controller
    socket.on("sign_up", (data) => signUp(data, io, socket.id));
    socket.on("log_in", data =>{
        logIn(data,io, socket)
        return user={email:data.email, password:data.password}
    });
    socket.on("log_out", () => logOut(io, socket));
    socket.on("delete_user", data => deleteUser(data,io, socket));
    socket.on("get_users", data=> getUsers(data, io, socket.id));
    socket.on("online", data=> online(data, io, socket.id));

    //Room controller
    socket.on("init_room", data=> initRoom(data, io, socket));
    socket.on("send_msg", data=> sendMessage(data, io, socket.id));
    socket.on("read_msg", data=> readBy(data, io, socket.id));
    socket.on("delete_msg", data=> deleteMsg(data, io, socket.id));
    socket.on("delete_chat", data=> deleteChat(data, io, socket.id));

    socket.on("log_user", ()=>console.log(user))

    socket.on("disconnect", ()=>{
        online({...user, online:false}, io, socket.id)
        console.log('disconnected', user)
    })
})

const port = process.env.PORT || 3001
server.listen(port, ()=>{
    console.log('Connected')
})

