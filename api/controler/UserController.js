const {
    singUpService,
    logInService, 
    deleteUserService, 
    getUsersService, 
    logOutService, 
    onlineService 
} = require('../service/UserService');

module.exports.signUp = (data) => {
    const { firstName, lastName, email, password } = data;
    /*
        vailidateInpuData = () => {
            firstName, lastName, email, password
        }; 
    */
    singUpService(firstName, lastName, email, password);
}

module.exports.logIn = (data) => {
    const { email, password } = data;
    /*
        vailidateInpuData = () => {
            firstName, lastName, email, password
        }; 
    */
    logInService(email, password);
}

module.exports.logOut = () => {
    logOutService();
}

module.exports.deleteUser = (data) => {
    const {email, password} = data;
    deleteUserService(email, password);
}

module.exports.getUsers = (data) => {
    const {email, password, otherUser} = data; 
    getUsersService(email, password, otherUser);
}

module.exports.online = (data) => {
    const { email, password, online } = data;
    onlineService(email, password, online);
}
