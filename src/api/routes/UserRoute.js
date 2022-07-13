const { 
    signUp, 
    logIn,
    logOut, 
    deleteUser,
    getUsers,
    online 
} = require('../controler/UserController');
const {errorCatch} = require('../helper/ErrorsUtils'); 

exports.userRoute =  (socket) => {
    console.log('id', socket.id);
    let user={};

    socket.on("sign_up", data => signUp(data));
    socket.on("log_in", data => {
        errorCatch(logIn(data), "log_in")
        return user = {
            email: data.email, 
            password: data.password
        };
    });
    socket.on("log_out", () => logOut());
    socket.on("delete_user", data => deleteUser(data));
    socket.on("get_users", data=> getUsers(data));
    socket.on("online", data=> online(data)); 
    socket.on("disconnect", () => {
        online({...user, online:false});
        console.log('disconnected', user);
    });
}
