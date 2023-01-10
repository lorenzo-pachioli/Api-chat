const {
    singUpService,
    logInService,
    deleteUserService,
    getUsersService,
    logOutService,
    onlineService,
    userExistByEmailService
} = require('../service/UserService');
const { checkPassword } = require('../validate/dbCheck');
const {
    idValidate,
    nameValidate,
    emailValidate,
    passwordValidate,
    booleanValidate
} = require('../validate/syntaxCheck');

exports.validateUser = async (email, password) => {

    const userCheck = await userExistByEmailService(email);
    if (!userCheck) throw new Error("Email used doesn't exist");
    if (!checkPassword(password, userCheck.password)) throw new Error("Wrong password");
    return userCheck;
}

exports.signUp = async (data) => {
    const { firstName, lastName, email, password } = data;

    if (!nameValidate(firstName, 'log_in_res')) throw new Error("Incorrect firstName form");
    if (!nameValidate(lastName, 'log_in_res')) throw new Error("Incorrect lastName form");
    if (!emailValidate(email, 'log_in_res')) throw new Error("Incorrect email form");
    if (!passwordValidate(password, 'log_in_res')) throw new Error("Incorrect password form");

    if (await userExistByEmailService(email)) throw new Error("Email used already has an account");

    const userCreated = await singUpService(firstName, lastName, email, password);
    toEvent("sign_up_res", userCreated);
}

exports.logIn = async (data) => {
    const { email, password, online } = data;

    if (!emailValidate(email, 'log_in_res')) throw new Error("Incorrect email form");
    if (!passwordValidate(password, 'log_in_res')) throw new Error("Incorrect password form");
    if (!booleanValidate(online, "online_res")) throw new Error("Incorrect online form");

    const userCheck = await this.validateUser(email, password);

    const legedIn = await logInService(userCheck._id);
    const userList = await getUsersService();
    const isOnline = await onlineService(userCheck._id, online);
    toEvent("log_in_res", legedIn);
    toEvent("get_users_res", userList);
    socketsEvent("online_res", isOnline);
}

exports.logOut = () => {
    logOutService();
}

exports.deleteUser = async (data) => {
    const { email, password } = data;

    if (!emailValidate(email, "delete_user_res")) throw new Error("Incorrect email form");
    if (!passwordValidate(password, "delete_user_res")) throw new Error("Incorrect password form");

    const userCheck = await this.validateUser(email, password);
    const userDeleted = await deleteUserService(userCheck._id);
    socketsEvent("delete_user_res", userDeleted);
}

exports.getUsers = async (data) => {
    const { email, password, otherUser } = data;

    if (!emailValidate(email, "get_users_res")) throw new Error("Incorrect email form");
    if (!passwordValidate(password, "get_users_res")) throw new Error("Incorrect password form");
    if (!idValidate(otherUser, "get_users_res")) throw new Error("Incorrect id form");

    await this.validateUser(email, password);

    const userList = await getUsersService(email, password, otherUser);
    toEvent("get_users_res", userList);
}

exports.online = async (data) => {
    const { email, password, online } = data;

    if (!emailValidate(email, "online_res")) throw new Error("Incorrect email form");
    if (!passwordValidate(password, "online_res")) throw new Error("Incorrect password form");
    if (!booleanValidate(online, "online_res")) throw new Error("Incorrect online form");

    const userCheck = await this.validateUser(email, password);

    const isOnline = await onlineService(userCheck._id, online);
    socketsEvent("online_res", isOnline);
}
