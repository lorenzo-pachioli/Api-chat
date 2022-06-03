require('./mongoDB');

const express = require('express')
const app = express()
const http = require('http')
const cors = require("cors")
const mongoose = require('mongoose');
const {Server} = require('socket.io')
const Message = require('./models/Message');

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000", 
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket)=> {
    console.log('id', socket.id)

    socket.on("join_room", (data)=>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);

        Message.find({room: data})
        .then(note => {
            socket.to(data).emit("receive_chat", note)
            mongoose.connection.close()
        })
        .catch( err => socket.to(data).emit("receive_chat", `Error: ${err.status}`))
        })

    socket.on("send_message", (data)=>{
        const newNote = Message({
            message: data.message,
            id: data.id,
            room: room,
            author: username,
            date: data.date
        })
        const newNoteError = Message({
            
            id: data.id,
            room: room,
            author: username,
            date: data.date
        })

        newNote.save()
        .then(note => {
        socket.to(note.room).emit("receive_message", note)
        mongoose.connection.close();
        })
        .catch(err =>socket.to(data.room).emit("receive_message", {...newNoteError, message: `error: ${err.status}`}))
        console.log(`User with ID: ${socket.id} sent msj: ${data}`);
    })

    socket.on("disconnect", ()=>{
        console.log('disconnected', socket.id)
    })
})










const port = process.env.PORT || 3001
server.listen(port, ()=>{
    console.log('Conected')
})