const User = require("../models/User");
const Room = require("../models/Room");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {getUsers} = require("./roomController")

module.exports.signUp = async(data,io, id)=>{
    try{
        const { firstName, lastName, email, password } = data;
        
        const userCheck = await User.findOne({ email: email });
        if (userCheck){
            io.to(id).emit("sign_up_res", { msg: "Email already used", status: false });
            return console.log("Email already used");
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password.toString(), salt);
        console.log('hash', hash)
        const newUser = User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash,
            online:false 
        })
        newUser.save()
        .then(() => io.to(id).emit("sign_up_res", {status: true}))
        .catch(err => io.to(id).emit("sign_up_res", {msg: "Error saving new user", status: false, error: err}));
    }catch(err){
        err => io.to(id).emit("sign_up_res", {msg: "Error creating new user", status: false, error: err});
    }
}

module.exports.logIn = async (data,io, socket)=>{
    try{
        const { email, password } = data;
        console.log("log_in_res 1");
        const userCheck = await User.findOne({ email: email });
        if(!userCheck){
            io.to(socket.id).emit("log_in_res", { msg: "Wrong email ", status: false });
            return console.log("Wrong email ")
        }
        if(!(bcrypt.compareSync(password, userCheck.password))){
            io.to(socket.id).emit("log_in_res", { msg: "Wrong password", status: false });
            return console.log("Wrong password");
        }
        
        const docRef =await Room.find({users:{$all:userCheck._id.toString()}})
        
        docRef.map((room)=>{
            socket.join(room._id.toString())
        })
        io.to(socket.id).emit("log_in_res", { status: true, user: userCheck, rooms: docRef});
        return console.log("log_in_res 2");
        
    }catch(err){
        io.to(socket.id).emit("log_in_res", { msg: "Error loging in", error:err, status: false });
        return console.log("Error loging in",err);
    }
}

module.exports.logOut = async (io, socket)=>{
    try{
        if(socket.connected){
            return socket.disconnect(true)
        }

    }catch(err){
        io.to(socket.id).emit("log_out_res", { msg: "Error disconnecting", error:err, status: err.status });
        return console.log("Error disconnecting", err);

    }
}

module.exports.deleteUser = async (data, io, socket)=>{
    try{
        const {_id, password} = data;
        const userCheck = await User.findById(_id);
        if(!(bcrypt.compareSync(password, userCheck.password))){
            io.to(socket.id).emit("delete_user_res", { msg: "Wrong password", status: false });
            return console.log("Wrong password");
        }
        const docRef =await User.findByIdAndDelete(_id, {new:true, password:0})
        console.log(docRef);
        /* const newUsersList = await User.find({},{password:0}) */
        io.broadcast.emit("delete_user_res", { msg: "User deleted", users: docRef, status: true });
        return console.log(docRef);    
        
        
    }catch(err){
        err => io.to(id).emit("log_out_res", { msg: "Error dsiconnecting", error:err, status: err.status });
    }
}

module.exports.getUsers = async (data, io, id)=>{
    try{
        const {email, password, otherUser} = data;
        console.log('get user 1')
        const userCheck = await User.findOne({ email: email });
        if(!userCheck){
            io.to(id).emit("get_users_res", {msg: "Error user doesn't exist",err:'get_user', status: false});
            return console.log("Error user doesn't exist", );
        }
        if(!(bcrypt.compareSync(password, userCheck.password))){
            io.to(socket.id).emit("get_users_res", { msg: "Wrong password", err:'get_user', status: false });
            return console.log("Wrong password");
        }
        if(otherUser){
            try{
                const docRef = await User.findById(otherUser, {password:0})
                io.to(id).emit("get_users_res", { users: {
                    _id:docRef._id,
                    firstName: docRef.firstName,
                    lastName: docRef.lastName,
                    email: docRef.email, 
                    online:docRef.online
                }, status: 200 });
                return console.log("get_users_res")
                
            }catch(err){
                io.to(id).emit("get_users_res", { msg: "Error geting user by id", error:err, status: false });
                return console.log("Error geting user by id")
            }
        }
        try{
            const docRef = await User.find({},{password:0})
            
            io.to(id).emit("get_users_res", { users: docRef, status: true });
            return console.log('get_users2')
        }catch(err){
            err => io.to(id).emit("get_users_res", { msg: "Error geting all users", error:err, status: false });
        }
    }catch(err){
        err=> io.to(id).emit("get_users_res", { msg: "Error geting users", error:err, status: false });
    }
}

module.exports.online = async (data, io,id)=>{
    try{
        const { email, password, online } = data;
        console.log('online ');
        const userCheck = await User.findOne({ email: email });
        if(!userCheck){
            io.to(id).emit("online_res", {msg: "Error user doesn't exist",error: err, status: false});
            return console.log("Error user doesn't exist");
        }
        console.log('online 1', password);
        if(!(bcrypt.compareSync(password, userCheck.password))){
            io.to(id).emit("online_res", { msg: "Wrong password",error: err, status: false });
            return console.log("Wrong password");
        }
        const update = {
            online: online
        } 
        const userOnline = await User.findByIdAndUpdate(userCheck._id, update,{new:true, password:0})
        
        io.sockets.emit("online_res", {user: userOnline, status: true})
        return console.log('online 2');
    }catch(err){
        io.to(id).emit('online_res', { msg: "error changing to online", error: err, status: false})
    }
}



