const User = require("../models/User");
const Message = require("../models/Message");

module.exports.joinRoom = async (data, io, id)=>{
    try{
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
        
        try{
            const docRef =await Message.find({room:data})
            Message.findByIdAndUpdate()
            io.sockets.in(data).emit("chat", docRef)
            console.log(`chat: ${docRef.length}, room:${data}`);
        }catch(err){
            console.log(`Error in geting chat: ${err}, data:${data}`);
            io.sockets.in(data).emit("join_room_res", `Error: ${err}`)
        }
    }catch(err){
        err => io.to(id).emit("join_room_res", {msj: "Error in saving msj", status: false, error: err});
    }
    
}