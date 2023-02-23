const { toEvent, socketsEvent } = require('../helper/SocketUtils');
const {
    singUpService,
    logInService,
    deleteUserService,
    getUsersService,
    logOutService,
    onlineService,
    userExistByEmailService,
    updateUserService
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

    if (!nameValidate(firstName)) throw new Error("Incorrect firstName form");
    if (!nameValidate(lastName)) throw new Error("Incorrect lastName form");
    if (!emailValidate(email)) throw new Error("Incorrect email form");
    if (!passwordValidate(password)) throw new Error("Incorrect password form");

    if (await userExistByEmailService(email)) throw new Error("Email used already has an account");

    const userCreated = await singUpService(firstName, lastName, email, password);
    toEvent("sign_up_res", userCreated);
}

exports.logIn = async (data) => {
    const { email, password, online } = data;

    if (!emailValidate(email)) throw new Error("Incorrect email form");
    if (!passwordValidate(password)) throw new Error("Incorrect password form");
    if (!booleanValidate(online)) throw new Error("Incorrect online form");

    const userCheck = await this.validateUser(email, password);

    const legedIn = await logInService(userCheck._id);
    const userList = await getUsersService();
    const isOnline = await onlineService(userCheck._id, online);
    toEvent("log_in_res", { ...legedIn, user: userCheck });
    toEvent("get_users_res", userList);
    socketsEvent("online_res", isOnline);
}

exports.logOut = () => {
    logOutService();
}

exports.updateUser = async (data) => {
    const { firstName, lastName, email, password } = data;

    if (!nameValidate(firstName)) throw new Error("Incorrect firstName form");
    if (!nameValidate(lastName)) throw new Error("Incorrect lastName form");
    if (!emailValidate(email)) throw new Error("Incorrect email form");
    if (password && !passwordValidate(password)) throw new Error("Incorrect password form");

    const user = await userExistByEmailService(email);
    if (!user) throw new Error("User to update doesn't exist");

    const userToUpdate = {
        ...user._doc,
        firstName,
        lastName,
        email
    };
    if (password.length > 0) userToUpdate.password = password;

    const userUpdated = await updateUserService(userToUpdate);
    toEvent("upadate_user_res", userUpdated);
}

exports.deleteUser = async (data) => {
    const { email, password } = data;

    if (!emailValidate(email)) throw new Error("Incorrect email form");
    if (!passwordValidate(password)) throw new Error("Incorrect password form");

    const userCheck = await this.validateUser(email, password);
    const userDeleted = await deleteUserService(userCheck._id);
    socketsEvent("delete_user_res", userDeleted);
}

exports.getUsers = async (data) => {
    const { email, password, otherUser } = data;

    if (!emailValidate(email)) throw new Error("Incorrect email form");
    if (!passwordValidate(password)) throw new Error("Incorrect password form");
    if (!idValidate(otherUser)) throw new Error("Incorrect id form");

    await this.validateUser(email, password);

    const userList = await getUsersService(email, password, otherUser);
    toEvent("get_users_res", userList);
}

exports.online = async (data) => {
    const { email, password, online } = data;

    if (!emailValidate(email)) throw new Error("Incorrect email form");
    if (!passwordValidate(password)) throw new Error("Incorrect password form");
    if (!booleanValidate(online)) throw new Error("Incorrect online form");

    const userCheck = await this.validateUser(email, password);

    const isOnline = await onlineService(userCheck._id, online);
    socketsEvent("online_res", isOnline);
}
