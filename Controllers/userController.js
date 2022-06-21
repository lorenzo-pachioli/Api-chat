const User = require("../models/User");
const Message = require("../models/Message");
const Room = require("../models/Room");


module.exports.signUp = async(data,io, id)=>{
    try{
        const { firstName, lastName, email, password } = data;
        const userCheck = await User.findOne({ email: email });
        if (userCheck){
            return io.to(id).emit("sign_up_res", { msg: "Email already used", status: false });
        }
        /* const hashedPassword = await bcrypt.hash(password, 10); */
        const newUser = User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password 
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
        const userCheck = await User.findOne({ email: email });
        console.log(userCheck)
        if(!userCheck._id){
            io.to(id).emit("log_in_res", { msg: "Wrong email ", status: false });
            return console.log("Wrong email ")
        }
        if(userCheck.password !== Number(password)){
            io.to(id).emit("log_in_res", { msg: "Wrong password", status: false });
            return console.log("Wrong password");
        }

        
        const docRef =await Room.find({users:{$all:userCheck._id.toString()}})
        docRef.map((room)=>{
            socket.join(room._id.toString())
        })
        return io.to(socket.id).emit("log_in_res", { status: true, user: userCheck, rooms: docRef });
        
    }catch(err){
        return io.to(socket.id).emit("log_in_res", { msg: "Error loging in", error:err, status: false });
    }
}

module.exports.logOut = async (io, socket)=>{
    try{
        if(socket.connected){
            return socket.disconnect(true)
        }

    }catch(err){
        return io.to(socket.id).emit("log_out_res", { msg: "Error disconnecting", error:err, status: err.status });

    }
}

module.exports.deleteUser = async (data, io, socket)=>{
    try{
        const {_id, password} = data;
        const userCheck = await User.findById(_id);
        if(userCheck.password !== Number(password)){
            io.to(socket.id).emit("delete_user_res", { msg: "Wrong password", status: false });
            return console.log("Wrong password");
        }
        try{
            const docRef =await User.findByIdAndDelete(_id)
            io.to(socket.id).emit("delete_user_res", { msg: "User deleted succesfully", user: docRef, status: 200 });
            return socket.disconnect(true)
        }catch(err){
            err=> io.to(socket.id).emit("delete_user_res", { msg: "Error deleting user",error:err, status: err.status })
        }
        
    }catch(err){
        return io.to(id).emit("log_out_res", { msg: "Error dsiconnecting", error:err, status: err.status });
    }
}

module.exports.getUsers = async (data, io, id)=>{
    try{
        const {_id, otherUser} = data;
        const userCheck = await User.findById(_id);
        if(!userCheck._id){
            io.to(id).emit("get_users_res", { msg: "Must be loged in to get list", status: false });
            return console.log("Must be loged in to get list")
        }
        if(otherUser){
            try{
                const docRef = await User.findById(otherUser, {password:0})
                io.to(id).emit("get_users_res", { users: {
                    _id:docRef._id,
                    firstName: docRef.firstName,
                    lastName: docRef.lastName,
                    email: docRef.email
                }, status: 200 });
                return console.log(docRef)
                
            }catch(err){
                io.to(id).emit("get_users_res", { msg: "Error geting user by id", error:err, status: false });
                return console.log("Error geting user by id")
            }
        }
        try{
            const docRef = await User.find({},{password:0})
            /* console.log(docRef) */
            return io.to(id).emit("get_users_res", { users: docRef, status: true });
        }catch(err){
            return io.to(id).emit("get_users_res", { msg: "Error geting all users", error:err, status: false });
        }
    }catch(err){
        return io.to(id).emit("get_users_res", { msg: "Error geting users", error:err, status: false });
    }
}




