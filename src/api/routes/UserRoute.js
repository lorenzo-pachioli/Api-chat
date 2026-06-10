const {
    signUp,
    logIn,
    logOut,
    deleteUser,
    getUsers,
    online
} = require('../controller/UserController');

exports.userRoute = (socket) => {
    console.log('id', socket.id);
    let user = {};

    socket.on("sign_up", data => signUp(data));
    socket.on("log_in", data => {
        logIn(data, socket);
        return user = {
            email: data.email,
            password: data.password
        };
    });
    socket.on("log_out", () => logOut());
    socket.on("delete_user", data => deleteUser(data, socket));
    socket.on("get_users", data => getUsers(data, socket));
    socket.on("online", data => online(data, socket));
    socket.on("disconnect", () => {
        if (socket.connected) online({ ...user, online: false }, socket);
        console.log('disconnected', user);
    });
}
