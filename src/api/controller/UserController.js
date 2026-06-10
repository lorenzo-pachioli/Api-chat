const { toEvent, socketsEvent } = require('../helper/SocketUtils');
const {
    singUpService,
    logInService,
    deleteUserService,
    getUsersService,
    logOutService,
    onlineService,
    userExistByEmailService,
    userExistService
} = require('../service/UserService');
const jwt = require('jsonwebtoken');
const { checkPassword } = require('../validate/dbCheck');
const {
    idValidate,
    nameValidate,
    emailValidate,
    passwordValidate,
    booleanValidate
} = require('../validate/syntaxCheck');
const UserDTO = require('../dto/UserDTO');

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

const authenticateSocket = async (socket) => {
    try {
        const cookieHeader = socket?.handshake?.headers?.cookie;
        if (cookieHeader) {
            const cookies = cookieHeader.split(';').reduce((acc, curr) => {
                const [key, value] = curr.split('=').map(c => c.trim());
                if (key && value) acc[key] = decodeURIComponent(value);
                return acc;
            }, {});
            if (cookies.token) {
                const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
                const user = await userExistService(decoded._id);
                if (user) return user;
            }
        }
    } catch (err) {
        console.error("Socket authentication error:", err.message);
    }
    return null;
};

exports.logIn = async (data, socket) => {
    const { email, password, online } = data;
    let userCheck = await authenticateSocket(socket);

    if (!userCheck) {
        if (!emailValidate(email)) throw new Error("Incorrect email form");
        if (!passwordValidate(password)) throw new Error("Incorrect password form");
        userCheck = await this.validateUser(email, password);
    }

    if (!booleanValidate(online)) throw new Error("Incorrect online form");

    const legedIn = await logInService(userCheck._id);
    const userList = await getUsersService();
    const isOnline = await onlineService(userCheck._id, online);
    toEvent("log_in_res", { ...legedIn, user: new UserDTO(userCheck) });
    toEvent("get_users_res", userList);
    socketsEvent("online_res", isOnline);
}

exports.logOut = () => {
    logOutService();
}

exports.deleteUser = async (data, socket) => {
    const { email, password } = data;
    let userCheck = await authenticateSocket(socket);

    if (!userCheck) {
        if (!emailValidate(email)) throw new Error("Incorrect email form");
        if (!passwordValidate(password)) throw new Error("Incorrect password form");
        userCheck = await this.validateUser(email, password);
    }

    const userDeleted = await deleteUserService(userCheck._id);
    socketsEvent("delete_user_res", userDeleted);
}

exports.getUsers = async (data, socket) => {
    const { email, password, otherUser } = data;
    let userCheck = await authenticateSocket(socket);

    if (!userCheck) {
        if (!emailValidate(email)) throw new Error("Incorrect email form");
        if (!passwordValidate(password)) throw new Error("Incorrect password form");
        await this.validateUser(email, password);
    }

    if (!idValidate(otherUser)) throw new Error("Incorrect id form");

    const userList = await getUsersService(otherUser);
    toEvent("get_users_res", userList);
}

exports.online = async (data, socket) => {
    const { email, password, online } = data;
    let userCheck = await authenticateSocket(socket);

    if (!userCheck) {
        if (!emailValidate(email)) throw new Error("Incorrect email form");
        if (!passwordValidate(password)) throw new Error("Incorrect password form");
        userCheck = await this.validateUser(email, password);
    }

    if (!booleanValidate(online)) throw new Error("Incorrect online form");

    const isOnline = await onlineService(userCheck._id, online);
    socketsEvent("online_res", isOnline);
}
