const {
    singUpService,
    logInService, 
    deleteUserService, 
    getUsersService, 
    logOutService, 
    onlineService 
} = require('../service/UserService');

exports.signUp = (data) => {
    const { firstName, lastName, email, password } = data;
    /*
        vailidateInpuData = () => {
            firstName, lastName, email, password
        }; 
    */
    singUpService(firstName, lastName, email, password);
}

exports.logIn = (data) => {
    const { email, password } = data;
    /*
        vailidateInpuData = () => {
            firstName, lastName, email, password
        }; 
    */
    logInService(email, password);
}

exports.logOut = () => {
    logOutService();
}

exports.deleteUser = (data) => {
    const {email, password} = data;
    deleteUserService(email, password);
}

exports.getUsers = (data) => {
    const {email, password, otherUser} = data; 
    getUsersService(email, password, otherUser);
}

exports.online = (data) => {
    const { email, password, online } = data;
    onlineService(email, password, online);
}
