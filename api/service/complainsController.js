const Complain = require('../models/Complain');
const Room = require('../models/Room');
const User = require("../models/User");

module.exports.initComplaint = async (data, io, socket)=>{
    try{
        const {sender, receiver, roomId, complain, url} = data;
        const user1 =await User.findById(sender,{password:0})
        const user2 =await User.findById(receiver,{password:0})
        if(!user1 || !user2){
            io.to(socket.id).emit("init_complain_res", {msg:'incorrect users id or they dont exist', status: false});
            return console.log('incorrect users id or they dont exist')
        }
        const roomCheck = await Room.findById(roomId)
        if(!roomCheck){
            io.to(socket.id).emit("init_complain_res", {msg:'incorrect chat id or it doesnt exit', status: false});
            return console.log('incorrect chat id or it doesnt exit')
        }
        const newComplain = Complain({
            complain: complain,
            sender: sender,
            receiver: receiver,
            chat: roomId,
            url: url
        })
        const docRef = await newComplain.save();
        io.to(socket.id).emit("init_complain_res", {complain:docRef, status: true})
        return console.log('complain');    
    }catch(err){
        return io.to(socket.id).emit("init_complain_res", {msg:'Error initiating room',error:err, status: false});
    }
}

module.exports.getComplains = async (data, io, id)=>{
    try{
        const {email, password, _id} = data;
        const userCheck = await User.findOne({ email: email });
        if(!userCheck){
            io.to(id).emit("get_complains_res", {msg: "Error user doesn't exist",err:'get_complain', status: false});
            return console.log("Error user doesn't exist", );
        }
        if(!(bcrypt.compareSync(password, userCheck.password))){
            io.to(socket.id).emit("get_complains_res", { msg: "Wrong password", err:'get_complain', status: false });
            return console.log("Wrong password");
        }
        const sentComplains = Complain.find({sender:{$all:_id}});
        const recieveComplains = Complain.find({receiver:{$all:_id}});
            
        io.to(id).emit("get_complains_res", { sent: sentComplains, receive: recieveComplains, status: true });
        return console.log("get_complains_res");
        
    }catch(err){
        err=> io.to(id).emit("get_complains_res", { msg: "Error geting complains", error:err, status: false });
    }
}