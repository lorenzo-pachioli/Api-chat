const {
    singUpService,
    logInService,
    deleteUserService,
    getUsersService,
    onlineService
} = require('../service/UserService');
const { initSocket } = require('../helper/SocketUtils');
const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');
const User = require('../models/User');
const Room = require('../models/Room');
const { errorCatch } = require('../helper/ErrorsUtils');
const mockingoose = require('mockingoose');
const bcrypt = require('bcrypt');
const Report = require('../models/Report');

let socket;
let httpServer;
let httpServerAddr;
let ioServer;
const newUser = {
    _id: "507f1f77bcf86cd799439011",
    firstName: 'Jhon',
    lastName: 'Dow',
    email: 'jhonD@gmail.com',
    password: '123456',
    online: false
};
const otherUser = {
    _id: "507f191e810c19729de860ea",
    firstName: 'Maria',
    lastName: 'Dow',
    email: 'mariaD@gmail.com',
    password: '123456',
    online: false
};


beforeAll((done) => {
    httpServer = http.createServer();
    httpServerAddr = httpServer.listen().address();
    ioServer = ioBack(httpServer);
    done();
});

afterAll((done) => {
    ioServer.close();
    httpServer.close();
    done();
});

beforeEach((done) => {
    socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
    });
    socket.on('connect', () => {
        done();
    });
    ioServer.on('connection', (mySocket) => {
        expect(mySocket).toBeDefined();
        initSocket(ioServer, mySocket);
    });
});

afterEach((done) => {
    if (socket.connected) socket.disconnect();
    done();
});


describe('UserService', () => {

    describe('singUp', () => {

        test('should return status true', (done) => {
            mockingoose(User)
                .toReturn(false, 'findOne');
            mockingoose(User)
                .toReturn(newUser, 'save');

            const { firstName, lastName, email, password } = newUser;
            errorCatch(singUpService(firstName, lastName, email, password), "sign_up");

            socket.on("sign_up_res", (arg) => {
                expect(arg.status).toBe(true);
                done();
            });
        });
    });

    describe('logIn', () => {

        test('should return status true', (done) => {
            const hashedPass = bcrypt.hashSync(newUser.password, 10);
            mockingoose(User)
                .toReturn({ ...newUser, password: hashedPass }, 'findOne');
            mockingoose(Room)
                .toReturn([], 'find');

            const { email, password } = newUser;
            errorCatch(logInService(email, password), "log_in");

            socket.on("log_in_res", (arg) => {
                expect(arg.status).toBe(true);
                expect(arg.user).toEqual({ ...newUser, password: hashedPass });
                expect(arg.rooms).toEqual([]);
                done();
            });
        });
    });

    describe('deleteUser', () => {

        test('should return status true', (done) => {
            const deletedUser = {
                _id: "507f1f77bcf86cd799439011",
                firstName: 'Jhon',
                lastName: 'Dow',
                email: 'jhonD@gmail.com',
                online: false
            };
            const hashedPass = bcrypt.hashSync(newUser.password, 10);

            mockingoose(User)
                .toReturn({ ...newUser, password: hashedPass }, 'findOne')
                .toReturn(deletedUser, 'findOneAndDelete')
                .toReturn([], 'find');
            mockingoose(Room)
                .toReturn([], 'find')
                .toReturn(true, 'deleteMany');
            mockingoose(Report).toReturn(true, 'deleteMany');

            const { email, password } = newUser;
            errorCatch(deleteUserService(email, password), "delete_user");

            socket.on("delete_user_res", (arg) => {
                expect(arg.status).toBe(true);
                expect(arg.userDeleted).toEqual(deletedUser);
                expect(arg.rooms).toEqual([]);
                expect(arg.users).toEqual([]);
                done();
            });
        });
    });

    describe('getUsers', () => {

        test('get all users should return status true', (done) => {
            const hashedPass = bcrypt.hashSync(newUser.password, 10);
            const users = [newUser, otherUser];
            mockingoose(User)
                .toReturn({ ...newUser, password: hashedPass }, 'findOne')
                .toReturn(users, 'find');

            const { email, password } = newUser;
            errorCatch(getUsersService(email, password), "get_users_res");

            socket.on("get_users_res", (arg) => {
                expect(arg.status).toBe(true);
                expect(arg.users).toEqual(users);
                done();
            });
        });

        test('get one user should return status true', (done) => {
            const hashedPass = bcrypt.hashSync(newUser.password, 10);
            mockingoose(User)
                .toReturn({ ...newUser, password: hashedPass }, 'findOne');

            const { email, password } = newUser;
            errorCatch(getUsersService(email, password, otherUser._id), "get_users_res");

            socket.on("get_users_res", (arg) => {
                expect(arg.status).toBe(true);
                expect(arg.users).toEqual({ ...newUser, password: hashedPass });
                done();
            });
        });
    });

    describe('online', () => {

        test('should return status true', (done) => {
            const hashedPass = bcrypt.hashSync(newUser.password, 10);
            mockingoose(User)
                .toReturn({ ...newUser, password: hashedPass }, 'findOne')
                .toReturn({ ...newUser, online: true }, 'findOneAndUpdate');

            const { email, password } = newUser;
            errorCatch(onlineService(email, password, true), "online");

            socket.on("online_res", (arg) => {
                expect(arg.status).toEqual(true)
                expect(arg.user).toEqual({ ...newUser, online: true })
                done();
            });
        });
    });
});
