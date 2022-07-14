const {
    singUpService,
    logInService,
    deleteUserService,
    getUsersService,
    logOutService,
    onlineService
} = require('../service/UserService');
const { idValidate, nameValidate, emailValidate, passwordValidate, booleanValidate } = require('../validate/syntaxCheck');

exports.signUp = async (data) => {
    const { firstName, lastName, email, password } = data;

    nameValidate(firstName, 'log_in_res');
    nameValidate(lastName, 'log_in_res');
    emailValidate(email, 'log_in_res');
    passwordValidate(password, 'log_in_res');

    await singUpService(firstName, lastName, email, password);
}

exports.logIn = async (data) => {
    const { email, password, online } = data;

    passwordValidate(password, 'log_in_res');
    emailValidate(email, 'log_in_res');
    booleanValidate(online, "online_res");
    
    await logInService(email, password);
    await getUsersService(email, password);
    await onlineService(email, password, online);
}

exports.logOut = () => {
    logOutService();
}

exports.deleteUser = async (data) => {
    const { email, password } = data;

    emailValidate(email, "delete_user_res");
    passwordValidate(password, "delete_user_res");

    await deleteUserService(email, password);
}

exports.getUsers = async (data) => {
    const { email, password, otherUser } = data;

    emailValidate(email, "get_users_res");
    passwordValidate(password, "get_users_res"); 
    idValidate(otherUser, "get_users_res");

    await getUsersService(email, password, otherUser);
}

exports.online = async (data) => {
    const { email, password, online } = data;

    emailValidate(email, "online_res"); 
    passwordValidate(password, "online_res"); 
    booleanValidate(online, "online_res");

    await onlineService(email, password, online);
}


