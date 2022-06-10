require('./mongoDB');

const express = require('express')
const app = express()
const http = require('http')
const cors = require("cors")
const mongoose = require('mongoose');
const {Server} = require('socket.io')
const Message = require('./models/Message');

app.use(express.json())
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000" 
    }
})

/* app.get('/', (request, response)=> {
    Message.find({})
        .then(note => {
            socket.to(data).emit("receive_chat", note)
            console.log('note',data, note);
            mongoose.connection.close()
        })
        .catch( err => socket.to(data).emit("receive_chat", `Error: ${err.status}`))
        
}) */

io.on("connection", (socket)=> {
    console.log('id', socket.id)

    socket.on("join_room", (data)=>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);

        Message.find({room:data})
        .then(note => {
            socket.to(data).emit("receive_chat", note)
            console.log(`chat: ${data}`);
        })
        .catch( err => {
            console.log(`Error in geting chat: ${err}, data:${data}`);
            socket.to(data).emit("receive_chat", `Error: ${err}`)
        })
    })

    socket.once("send_message", (data)=>{
        console.log("data.time", data.time)
        const newNote = Message({
            room: data.room,
            time: data.time,
            message: data.message,
            username: data.username
        })
        const newNoteError = Message({
            content: data,
        })

        console.log("data", newNote)

        newNote.save()
        .then(message => {
            socket.to(data.room).emit("receive_message", message)
            console.log(`User with ID: ${socket.id} sent msj: ${message.message}`);
            
        })
        .catch(err =>{
            console.log(`Error in saving msj: ${err}`);
            socket.to(data.room).emit("receive_message", {...newNoteError, message: `error: ${err.status}`})
            
        })
        
    })

    socket.on("disconnect", ()=>{
        console.log('disconnected', socket.id)
    })
})










const port = process.env.PORT || 3001
server.listen(port, ()=>{
    console.log('Connected')
})

