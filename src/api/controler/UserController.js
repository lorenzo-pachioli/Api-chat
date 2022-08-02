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

    if (nameValidate(firstName, 'log_in_res')) throw new Error("Incorrect firstName form");
    if (nameValidate(lastName, 'log_in_res')) throw new Error("Incorrect lastName form");
    if (emailValidate(email, 'log_in_res')) throw new Error("Incorrect email form");
    if (passwordValidate(password, 'log_in_res')) throw new Error("Incorrect password form");

    await singUpService(firstName, lastName, email, password);
}

exports.logIn = async (data) => {
    const { email, password, online } = data;

    if (emailValidate(email, 'log_in_res')) throw new Error("Incorrect email form");
    if (passwordValidate(password, 'log_in_res')) throw new Error("Incorrect password form");
    if (booleanValidate(online, "online_res")) throw new Error("Incorrect online form");

    await logInService(email, password);
    await getUsersService(email, password);
    await onlineService(email, password, online);
}

exports.logOut = () => {
    logOutService();
}

exports.deleteUser = async (data) => {
    const { email, password } = data;

    if (!emailValidate(email, "delete_user_res")) throw new Error("Incorrect email form");
    if (!passwordValidate(password, "delete_user_res")) throw new Error("Incorrect password form");

    await deleteUserService(email, password);
}

exports.getUsers = async (data) => {
    const { email, password, otherUser } = data;

    if (!emailValidate(email, "get_users_res")) throw new Error("Incorrect email form");
    if (!passwordValidate(password, "get_users_res")) throw new Error("Incorrect password form");
    if (!idValidate(otherUser, "get_users_res")) throw new Error("Incorrect id form");

    await getUsersService(email, password, otherUser);
}

exports.online = async (data) => {
    const { email, password, online } = data;

    if (!emailValidate(email, "online_res")) throw new Error("Incorrect email form");
    if (!passwordValidate(password, "online_res")) throw new Error("Incorrect password form");
    if (!booleanValidate(online, "online_res")) throw new Error("Incorrect online form");

    await onlineService(email, password, online);
}


