const User = require("../models/User");
const Message = require("../models/Message");

module.exports.sendMsg = async (data, io, id)=>{
    try{
        const newNote = Message({
            room: data.room,
            time: data.time,
            message: data.message,
            username: data.username
        })
        newNote.save()
        .then(message => {
            io.sockets.in(data.room).emit("receive_message", message)
            console.log(`User with ID: ${socket.id} sent msj: ${message.message}`);
            
        })
        .catch(err =>{
            console.log(`Error in saving msj: ${err}`);
            io.sockets.in(data.room).emit("receive_error", { message:'Error in saving msj', error:`error: ${err}`, status:false})
            
        })

    }catch(err){
        err => io.to(id).emit("sign_up_res", {msj: "Error in saving msj", status: false, error: err});
    }
}