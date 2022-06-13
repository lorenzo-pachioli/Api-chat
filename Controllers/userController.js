const User = require("../models/User");
const Message = require("../models/Message");


module.exports.signup = async(data,io)=>{
    try{
        const { firstName, lastName, type, email, password } = data;
        const userCheck = await User.findOne({ email: email });
        if (userCheck){
            io.sockets.in(email).emit("sign_up_res", { msg: "Email already used", status: false });
            return  socket.disconnect(true)
        }
        /* const hashedPassword = await bcrypt.hash(password, 10); */
        const newUser = User({
            firstName: firstName,
            lastName: lastName,
            type: type,
            email: email,
            password: password 
        })
        newUser.save()
        .then(response => io.sockets.in(email).emit("sign_up_res", { status: true, response }))
        .catch(err => io.sockets.in(email).emit("sign_up_res", {msj: "Error saving new user", status: false, error: err}));
    }catch(err){
        err => io.sockets.in(email).emit("sign_up_res", {msj: "Error creating new user", status: false, error: err});
    }
}

module.exports.login = async (data,io)=>{
    try{
        const { email, password } = data;
        const userCheck = await User.findOne({ email: email });
        if(!userCheck){
            io.sockets.to(io.socket.id).emit("log_in_res", { msg: "Wrong email ", status: false });
            return  socket.disconnect(true)
        }else if(userCheck.password !== password){
            io.sockets.to(io.socket.id).emit("log_in_res", { msg: "Wrong password", status: false });
            return socket.disconnect(true)
        }

        try{
            const docRef =await Message.find()
            io.sockets.to(io.socket.id).emit("log_in_res", docRef)
        }catch(err){
            io.sockets.to(io.socket.id).emit("log_in_res", {error: err})
        }
    }catch(err){
        io.sockets.to(io.socket.id).emit("log_in_res", { msg: "Error loging in", error:err, status: false });
    }
}

module.exports.logOut = async (io)=>{
    try{
        socket.disconnect(true)
    }catch(err){
        io.sockets.to(io.socket.id).emit("log_out_res", { msg: "Error disconnecting", error:err, status: false });

    }
}

module.exports.deleteUser = async (data, io)=>{
    try{
        const {_id} = data;
        if(!io.socket.connected){
            io.sockets.to(io.socket.id).emit("delete_user_res", { msg: "Must be connected to delete user", status: false });
        }
        User.findByIdAndDelete({_id:_id})
        then(()=> socket.disconnect(true))
        .catch(err=> io.sockets.to(io.socket.id).emit("delete_user_res", { msg: "Error deleting user",error:err, status: false }))
    }catch(err){
        io.sockets.to(io.socket.id).emit("log_out_res", { msg: "Error dsiconnecting", error:err, status: false });
    }
}




