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

    socket.on("sign_up", data => errorCatch(signUp(data)));
    socket.on("log_in", data => {
        errorCatch(logIn(data), "log_in")
        return user = {
            email: data.email, 
            password: data.password
        };
    });
    socket.on("log_out", () => logOut());
    socket.on("delete_user", data => errorCatch(deleteUser(data)));
    socket.on("get_users", data=> errorCatch(getUsers(data)));
    socket.on("online", data=> errorCatch(online(data))); 
    socket.on("disconnect", () => {
        errorCatch(online({...user, online:false}));
        console.log('disconnected', user);
    });
}
