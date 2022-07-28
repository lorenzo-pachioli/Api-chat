const {
    initReportService,
    getComplainsService
} = require('../service/ReportChatService');
const { initSocket } = require('../helper/SocketUtils');
const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');
const User = require('../models/User');
const Room = require('../models/Room');
const Report = require('../models/Report');
const { errorCatch } = require('../helper/ErrorsUtils');
const mockingoose = require('mockingoose');
const bcrypt = require('bcrypt');

let socket, httpServer, httpServerAddr, ioServer;

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

const newReport = {
    complain: 'Some complain',
    sender: newUser._id,
    receiver: otherUser._id,
    chat: room._id,
    url: 'www.base64URL.com'
}

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

describe('ReportChatService', () => {

    describe('initReportService', () => {

        test('should return status true and the complain created', () => {
            mockingoose(User).toReturn(newUser, 'findOne');
            mockingoose(Room).toReturn(room, 'findOne');
            mockingoose(Report).toReturn(newReport, 'save');

            errorCatch(initReportService(newUser._id, otherUser._id, room._id, newReport.complain, newReport.url), "init_report")

            socket.on("init_report_res", (arg) => {
                expect(arg.complain).toEqual(newReport.complain);
                expect(arg.status).toBe(true);
                done();
            });
        })
    });

    describe('getComplainsService', () => {

        test('should return status true, set and recive complains', () => {
            const hashedPass = bcrypt.hashSync(newUser.password, 10);
            mockingoose(User).toReturn({ ...newUser, password: hashedPass }, 'findOne');
            mockingoose(Report).toReturn([newReport], 'find');

            errorCatch(getComplainsService(newUser.email, newUser.password), "get_complains")

            socket.on("get_complains_res", (arg) => {
                expect(arg.sent).toEqual([newReport]);
                expect(arg.receive).toEqual([newReport]);
                expect(arg.status).toBe(true);
                done();
            });
        })
    });


});
