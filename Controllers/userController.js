const User = require("../models/User");
const Message = require("../models/Message");


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
        .then(response => io.to(id).emit("sign_up_res", { status: true, response }))
        .catch(err => io.to(id).emit("sign_up_res", {msj: "Error saving new user", status: err.status, error: err}));
    }catch(err){
        err => io.to(id).emit("sign_up_res", {msj: "Error creating new user", status: err.status, error: err});
    }
}

module.exports.logIn = async (data,io, id)=>{
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

        try{
            const docRef =await Message.find({})
            io.to(id).emit("log_in_res", { status: true, user: userCheck, messages: docRef })
        }catch(err){
            io.to(id).emit("log_in_res", {error: err})
        }
    }catch(err){
        io.to(id).emit("log_in_res", { msg: "Error loging in", error:err, status: false });
    }
}

module.exports.logOut = async (io, socket)=>{
    try{
        if(socket.connected){
            socket.disconnect(true)
        }

    }catch(err){
        io.to(socket.id).emit("log_out_res", { msg: "Error disconnecting", error:err, status: err.status });

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
            socket.disconnect(true)
        }catch(err){
            err=> io.to(socket.id).emit("delete_user_res", { msg: "Error deleting user",error:err, status: err.status })
        }
        
    }catch(err){
        io.to(id).emit("log_out_res", { msg: "Error dsiconnecting", error:err, status: err.status });
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
                const docRef = await User.findById(otherUser)
                io.to(id).emit("get_users_res", { users: {
                    _id:docRef._id,
                    firstName: docRef.firstName,
                    lastName: docRef.lastName,
                    email: docRef.email
                }, status: 200 });
                
            }catch(err){
                io.to(id).emit("get_users_res", { msg: "Error geting user by id", error:err, status: err.status });
                return console.log("Error geting user by id")
            }
        }
        try{
            const docRef = await User.find({})
            const passwordFiltered = docRef.map((user)=>{
                return {
                    _id:user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            })
            io.to(id).emit("get_users_res", { users: passwordFiltered, status: 200 });
        }catch(err){
            io.to(id).emit("get_users_res", { msg: "Error geting all users", error:err, status: err.status });
        }
    }catch(err){
        io.to(id).emit("get_users_res", { msg: "Error geting users", error:err, status: err.status });
    }
}




