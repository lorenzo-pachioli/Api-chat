require('./mongoDB');

const express = require('express')
const app = express()
const http = require('http')
const cors = require("cors")
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

io.on("connect", (socket)=> {
    console.log('id', socket.id)

    socket.on("join_room",async (data)=>{
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
        
        try{
            const docRef =await Message.find({room:data})
            io.sockets.in(data).emit("chat", docRef)
            console.log(`chat: ${docRef.length}, room:${data}`);
        }catch(err){
            console.log(`Error in geting chat: ${err}, data:${data}`);
            io.sockets.in(data).emit("receive_error", `Error: ${err}`)
        }
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
            io.sockets.in(data.room).emit("receive_message", message)
            console.log(`User with ID: ${socket.id} sent msj: ${message.message}`);
            
        })
        .catch(err =>{
            console.log(`Error in saving msj: ${err}`);
            io.sockets.in(data.room).emit("receive_error", {...newNoteError, message: `error: ${err.status}`})
            
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

