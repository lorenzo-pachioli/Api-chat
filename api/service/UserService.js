const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/User");
const Room = require('../models/Room')

async function alreadyExist(email){
    const userCheck = await User.find({ email: email });
    return userCheck ? userCheck[0]:false ;
}
function checkPassword(password, hashPassword, io, id){
    if(!bcrypt.compareSync(password,  hashPassword)){
        console.log('wrong pass')
        io.to(id).emit("log_in_res", { msg: "Wrong password", status: false });
        return false
    }
    return true;
}

module.exports.singUp = async (firstName, lastName, email, password, io, id) => {
    try {
        if(alreadyExist(email)) {
            io.to(id).emit("sign_up_res", { msg: "Email already used", status: false });
            return console.log(" no sign_up_res")
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
        });
        await newUser.save()
        io.to(id).emit("sign_up_res", {status: true})
        return console.log("sign_up_res")
    } catch(err) {
        err => io.to(id).emit("sign_up_res", {msg: "Error creating new user", status: false, error: err});
    }
}

module.exports.logIn = async (email, password, io, socket) => {
    try{
        const userCheck = await alreadyExist(email);
        if(!userCheck) {
            io.to(socket.id).emit("log_in_res", { msg: "Wrong email ", status: false });
            return console.log(" no log_in_res")
        }
        if(!checkPassword(password, userCheck.password, io, socket.id)){
            return console.log(" no log_in_res");
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