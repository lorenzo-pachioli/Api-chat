const io = require('../../index');
const {signUp,logIn,logOut, deleteUser,getUsers,online } = require('../controler/UserController');

module.exports.userRoute = (io, socket)=>{
    
    console.log('id', socket.id);
    let user={};
    socket.on("sign_up", (data) => signUp(data, io, socket.id));
    socket.on("log_in", data =>{
        logIn(data,io, socket)
        return user={email:data.email, password:data.password}
    });
    socket.on("log_out", () => logOut(io, socket));
    socket.on("delete_user", data => deleteUser(data,io, socket));
    socket.on("get_users", data=> getUsers(data, io, socket.id));
    socket.on("online", data=> online(data, io, socket.id)); 
    
}
