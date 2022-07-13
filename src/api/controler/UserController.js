const {
    singUpService,
    logInService,
    deleteUserService,
    getUsersService,
    logOutService,
    onlineService
} = require('../service/UserService');
const { idValidate, nameValidate, emailValidate, passwordValidate, booleanValidate } = require('../validate/syntaxCheck');

exports.signUp = (data) => {
    const { firstName, lastName, email, password } = data;

    if (!nameValidate(firstName, 'log_in_res') || !nameValidate(lastName, 'log_in_res')) {
        return false;
    };
    if (!emailValidate(email, 'log_in_res') || !passwordValidate(password, 'log_in_res')) {
        return false;
    };

    singUpService(firstName, lastName, email, password);
}

exports.logIn = async (data) => {
    const { email, password, online } = data;

    if (!emailValidate(email, 'log_in_res') || !passwordValidate(password, 'log_in_res')) {
        return false;
    };
    if (!booleanValidate(online, "online_res")) {
        return false;
    };
    
    await logInService(email, password);
    await getUsersService(email, password);
    await onlineService(email, password, online);
}

exports.logOut = () => {
    logOutService();
}

exports.deleteUser = (data) => {
    const { email, password } = data;

    if (!emailValidate(email, "delete_user_res") || !passwordValidate(password, "delete_user_res")) {
        return false;
    };

    deleteUserService(email, password);
}

exports.getUsers = (data) => {
    const { email, password, otherUser } = data;

    if (!emailValidate(email, "get_users_res") || !passwordValidate(password, "get_users_res")) {
        return false;
    };
    if (!idValidate(otherUser, "get_users_res")) {
        return false;
    };

    getUsersService(email, password, otherUser);
}

exports.online = (data) => {
    const { email, password, online } = data;

    if (!emailValidate(email, "online_res") || !passwordValidate(password, "online_res")) {
        return false;
    };
    if (!booleanValidate(online, "online_res")) {
        return false;
    };

    onlineService(email, password, online);
}


