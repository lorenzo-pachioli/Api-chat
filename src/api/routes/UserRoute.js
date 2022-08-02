const {
    signUp,
    logIn,
    logOut,
    deleteUser,
    getUsers,
    online
} = require('../controler/UserController');
const { errorCatch } = require('../helper/ErrorsUtils');

exports.userRoute = (socket) => {
    console.log('id', socket.id);
    let user = {};

    socket.on("sign_up", data => errorCatch(signUp(data), "sign_up"));
    socket.on("log_in", data => {
        errorCatch(logIn(data), "log_in");
        return user = {
            email: data.email,
            password: data.password
        };
    });
    socket.on("log_out", () => logOut());
    socket.on("delete_user", data => errorCatch(deleteUser(data), "delete_user"));
    socket.on("get_users", data => errorCatch(getUsers(data), "get_users"));
    socket.on("online", data => errorCatch(online(data), "online"));
    socket.on("disconnect", () => {
        if (socket.connected) {
            errorCatch(online({ ...user, online: false }), "online");
        }
        console.log('disconnected', user);
    });
}
