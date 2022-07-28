const {
    initRoomService,
    sendMessageService,
    readByService,
    deleteMsgService,
    deleteChatService,
    joinRoomService
} = require('../service/RoomService');
const { initSocket, joinRoom } = require('../helper/SocketUtils');
const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');
const User = require('../models/User');
const Room = require('../models/Room');
const { errorCatch } = require('../helper/ErrorsUtils');
const mockingoose = require('mockingoose');

let socket, httpServer,httpServerAddr, ioServer, serverSocket;

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

const room = {
    _id: "507f1f77bcf86cd7994388db",
    messages: [],
    users: [newUser._id, otherUser._id]
};

const newMessage = {
    _id: "507f191e810c19729de845ac",
    message: 'New message',
    room: room._id,
    user: newUser._id,
    readBy: [newUser._id],
    time: '28/7/2022'
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
        serverSocket = mySocket;
        mockingoose(User).toReturn(newUser, 'findOne');
    });
});

afterEach((done) => {
    if (socket.connected) socket.disconnect();
    done();
});

describe('RoomService', () => {

    describe('initRoomService', () => {

        test('should return room already exist and join that room', (done) => {
            mockingoose(Room).toReturn(room, 'find');

            errorCatch(initRoomService(newUser._id, otherUser._id), "init_room");

            socket.on("init_room_res", (arg) => {
                const validateJoinRoom = ioServer.sockets.adapter.rooms.get(arg.room._id.toString()).has(serverSocket.id);
                expect(validateJoinRoom).toBe(true);
                expect(arg.room).toEqual(room);
                expect(arg.status).toBe(true);
                done();
            });
        });

        test('should create a new room and join that room', (done) => {
            mockingoose(Room)
                .toReturn(false, 'find')
                .toReturn(room, 'save')

            errorCatch(initRoomService(newUser._id, otherUser._id), "init_room");

            socket.on("init_room_res", (arg) => {
                const validateJoinRoom = ioServer.sockets.adapter.rooms.get(arg.room._id.toString()).has(serverSocket.id);
                expect(validateJoinRoom).toBe(true);
                expect(arg.room).toEqual(room);
                expect(arg.status).toBe(true);
                done();
            });
        });
    });

    describe('sendMessageService', () => {

        test('should return status true, room updated and new message', (done) => {
            mockingoose(Room)
                .toReturn(room, 'findOne')
                .toReturn({ ...room, messages: [newMessage] }, 'findOneAndUpdate')

            joinRoom(room._id);
            errorCatch(sendMessageService(newUser._id, room._id, 'New message'), "send_msg_res");

            socket.on("send_msg_res", (arg) => {
                expect(arg.room).toEqual({ ...room, messages: [newMessage] });
                expect(arg.newMessage.room).toBe(room._id);
                expect(arg.status).toBe(true);
                done();
            });
        });
    });

    describe('joinRoomService', () => {
        test('should join the room', (done) => {
            mockingoose(Room).toReturn(room, 'findOne');

            Promise.resolve(joinRoomService(newUser._id, room._id))
                .then(() => {
                    const validateJoinRoom = ioServer.sockets.adapter.rooms.get(room._id).has(serverSocket.id);
                    expect(validateJoinRoom).toBe(true);
                    done();
                });
        });
    });

    describe('readByService', () => {
        test('should return status true', (done) => {
            newMessage.readBy.push(otherUser._id);
            const roomUpdated = { ...room, messages: [newMessage] };
            mockingoose(Room)
                .toReturn(room, 'findOne')
                .toReturn(roomUpdated, 'findOneAndUpdate')

            joinRoom(room._id);
            errorCatch(readByService(otherUser._id, room._id), "read_msg");

            socket.on("read_msg_res", (arg) => {
                expect(arg.room).toEqual(roomUpdated);
                expect(arg.status).toBe(true);
                done();
            });
        });
    });

    describe('deleteMsgService ', () => {

        test('should return status true and room without message', (done) => {
            const roomUpdated = { ...room, messages: [newMessage] };
            mockingoose(Room)
                .toReturn(roomUpdated, 'findOne')
                .toReturn(room, 'findOneAndUpdate')

            joinRoom(room._id);
            errorCatch(deleteMsgService(newUser._id, room._id, newMessage._id), "delete_msg");

            socket.on("delete_msg_res", (arg) => {
                expect(arg.room).toEqual(room);
                expect(arg.status).toBe(true);
                done();
            });
        });
    });

    describe('deleteChatService', () => {

        test('should return status true and room deleted', (done) => {
            mockingoose(Room)
                .toReturn(room, 'findOne')
                .toReturn(room, 'findOneAndDelete')

            joinRoom(room._id);
            errorCatch(deleteChatService(newUser._id, room._id), "delete_chat");

            socket.on("delete_chat_res", (arg) => {
                expect(arg.room).toEqual(room);
                expect(arg.status).toBe(true);
                done();
            });
        });
    });
});


