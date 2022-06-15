const Room = require('../models/Room');
const User = require("../models/User");
const Message = require("../models/Message");

module.exports.initRoom = async (data, io, socket)=>{
    try{
        const {_id, otherUser} = data;
        
        const user1 = User.findById(_id,{password:0})
        const user2 = User.findById(otherUser,{password:0})
        if(!user1 || !user2){
            io.to(id).emit("init_room_res", {msg:'incorrect users id or they dont exist',room:[], status: false});
            return console.log('incorrect users id or they dont exist')
        }
        const roomCheck = Room.find({users:{$all:[_id, otherUser]}})
        if(roomCheck._id){
            const updateSend = {
                $addToSet: { "messages.$[].readBy": _id}
            };
            const docRef =await Room.findByIdAndUpdate(room_id, updateSend, {new:true})
            io.to(id).emit("init_room_res", {msg:`Joined to room ${roomCheck._id}`,room: docRef, status: true});
            return socket.join(roomCheck._id);
        }
       
        const newRoom = Room({
            messages:[],
            users:[user1, user2] 
        })
        try{
            const docRef = await newRoom.save()
            socket.join(docRef._id)
        }catch(err){
            io.to(id).emit("init_room_res", {msg:'Error saving room',error:err, status: false});
        }
    }catch(err){
        io.to(id).emit("init_room_res", {msg:'Error initiating room',error:err, status: false});
    }
}

module.exports.sendMessage = async (data, io, id)=>{
    try{
        const {_id, room_id, message} = data;
        const roomCheck= Room.findById(room_id);
        if(!roomCheck){
            io.to(id).emit("send_msg_res", {msj: `Room ${room_id} doesn't exist`, status: false});
        }
        if(!(roomCheck.users.some((user)=> user._id === _id))){
            io.to(id).emit("send_msg_res", {msj: "Must be part of the room to send message", status: false});
        }
        const newMessage = Message({
            message: message,
            room: room_id,
            user: _id,
            readBy:[_id],
            time: new Date(Date.now())
        })
        try{
            const updateSend = {
                $addToSet: { "messages.$[].readBy": _id},
                $push:{messages: newMessage}
            };
            const docRef =await Room.findByIdAndUpdate(room_id, updateSend, {new:true})
            io.sockets.in(room_id).emit("send_msg", docRef, newMessage)
            console.log(`chat: ${docRef._id}`);
        }catch(err){
            console.log(`Error in geting chat: ${err}`);
            io.to(id).emit("send_msg_res", {msj: "Error in saving message",error:err, status: false});
        }
    }catch(err){
        io.to(id).emit("send_msg_res", {msj: "Error in geting data", error:err, status: false});
    }
}

module.exports.readBy = async (data, io, id)=>{
    try{
        const{_id, room_id} = data;
        const userCheck = await User.findById(_id)
        if(!userCheck){
            io.to(id).emit("read_msg_res", {msj: "Error user doesn't exist", status: false});
            return console.log("Error user doesn't exist");
        }
        const updateSend = {
            $addToSet: { "messages.$[].readBy": _id}
        };
        const docRef =await Room.findByIdAndUpdate(room_id, updateSend, {new:true})
        io.sockets.in(room_id).emit("read_msg_res", docRef);

    }catch(err){
        io.to(id).emit("read_msg_res", {msj: "Error in geting data", error:err, status: false});
    }
}

