const Room = require('../models/Room');
const User = require("../models/User");
const Message = require("../models/Message");

module.exports.initRoom = async (data, io, socket)=>{
    try{
        const {_id, otherUser} = data;
        const user1 =await User.findById(_id,{password:0})
        const user2 =await User.findById(otherUser,{password:0})
        if(!user1 || !user2){
            io.to(socket.id).emit("init_room_res", {msg:'incorrect users id or they dont exist',room:[], status: false});
            return console.log('incorrect users id or they dont exist')
        }
        const roomCheck = await Room.find({users:{$all:[_id.toString(), otherUser.toString()]}})
        if(roomCheck[0]){
            let docRef = roomCheck[0];
            if(roomCheck[0].messages.length > 0){
                const updateSend = {
                    $addToSet: { "messages.$[].readBy": _id}
                };
                docRef =await Room.findByIdAndUpdate(roomCheck[0]._id.toString(), updateSend, {new:true})
            }
            socket.join(docRef._id.toString())
            io.to(socket.id).emit("init_room_res", {msg:`Joined to room ${roomCheck[0]._id}`,room: docRef, status: true});
            return console.log(`Joined to room ${roomCheck[0]._id}`)
        }
        const newRoom = Room({
            messages:[],
            users:[_id, otherUser] 
        })
        const docRef = await newRoom.save()
        socket.join(docRef._id)
        io.sockets.in(docRef._id).emit("init_room_res", {room:docRef, status: true})
        return console.log('docRef', docRef);    
    }catch(err){
        return io.to(socket.id).emit("init_room_res", {msg:'Error initiating room',error:err, status: false});
    }
}

module.exports.sendMessage = async (data, io, id)=>{
    try{
        const {_id, room, message} = data;
        console.log(data)
        const userCheck = await User.findById(_id)
        if(!userCheck){
            io.to(id).emit("delete_chat_res", {msg: "Error user doesn't exist", status: false});
            return console.log("Error user doesn't exist");
        }
        const roomCheck= await Room.findById(room)
        if(!roomCheck){
            io.to(id).emit("send_msg_res", {msg: `Room ${room} doesn't exist`, status: false});
            return console.log( `Room ${room} doesn't exist`)
        }
        if(!(roomCheck.users.some((user)=> user._id !== _id))){
            io.to(id).emit("send_msg_res", {msg: "Must be part of the room to send message", status: false});
            return console.log("Must be part of the room to send message")
        }
        const newMessage = Message({
            message: message,
            room: room,
            user: _id,
            readBy:[_id],
            time: new Date(Date.now())
        })
        const updateRead = {
            $addToSet:{"messages.$[].readBy": _id}
        };
        const updateSend = {
            $addToSet:{messages: newMessage}
        };
        roomCheck.messages.length > 0 ? (await Room.findByIdAndUpdate(room, updateRead)):('')
        const docRef =await Room.findByIdAndUpdate(room, updateSend, {new:true})
        io.sockets.in(room).emit("send_msg_res", {room:docRef, newMessage:newMessage, status:true})
        return console.log(`chat: ${docRef}`);
       
    }catch(err){
        io.to(id).emit("send_msg_res", {msg: "Error in geting data", error:err, status: false});
        return console.log(`Error in geting data: ${err}`);
    }
}

module.exports.readBy = async (data, io, id)=>{
    try{
        const{_id, room_id} = data;
        const userCheck = await User.findById(_id)
        if(!userCheck){
            io.to(id).emit("read_msg_res", {msg: "Error user doesn't exist", status: false});
            return console.log("Error user doesn't exist");
        }
        const updateSend = {
            $addToSet:{"messages.$[].readBy": _id}
        };
        
        const docRef =await Room.findByIdAndUpdate(room_id, updateSend, {new:true})
        console.log(docRef.messages[docRef.messages.length - 50],docRef.messages[docRef.messages.length - 1])
       io.sockets.in(room_id).emit("read_msg_res", {room:docRef, status:true});
       return console.log("read_msg_res", room_id);

    }catch(err){
        io.to(id).emit("read_msg_res", {msg: "Error in geting data", error:err, status: false});
        return console.log("Error in geting data",err);
    }
}

module.exports.deleteMsg = async (data, io, id)=>{
    try{
        const{_id,room_id, message_id} = data;
        console.log(data)
        const userCheck = await User.findById(_id)
        if(!userCheck){
            io.to(id).emit("delete_msg_res", {msg: "Error user doesn't exist", status: false});
            return console.log("Error user doesn't exist");
        }
        const updateDelete = {
            $pull: {messages: {_id: new ObjectId(message_id)}}
        };

        const docRef =await Room.findByIdAndUpdate(room_id, updateDelete,{new:true})
        
        io.sockets.in(room_id).emit("delete_msg_res", {room:docRef, status:true});
        return console.log(docRef)

    }catch(err){
        io.to(id).emit("delete_msg_res", {msg: "Error in geting data", error:err, status: false});
        return console.log("Error in geting data", err);
    }
}

module.exports.deleteChat = async (data, io, id)=>{
    try{
        const{_id,room_id} = data;
        const userCheck = await User.findById(_id)
        if(!userCheck){
            io.to(id).emit("delete_chat_res", {msg: "Error user doesn't exist", status: false});
            return console.log("Error user doesn't exist");
        }
        const docRef =await Room.findByIdAndDelete(room_id,{new:true})
        
        io.sockets.in(room_id).emit("delete_chat_res", {room:docRef, status:true});
        return console.log(docRef)

    }catch(err){
        return io.to(id).emit("delete_chat_res", {msg: "Error in geting data", error:err, status: false});
    }
}

