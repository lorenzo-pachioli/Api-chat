const Report = require('../models/Report');
const Room = require('../models/Room');
const User = require('../models/User');
const { reportModeling } = require('../helper/ModelUtils');
const { toEvent, brodcastEvent, disconnectSocket, joinRoom, socketsEvent, socketsInEvent } = require('../helper/SocketUtils');
const { alreadyExistById, alreadyExistByEmail, checkPassword } = require('../validate/dbCheck');

exports.initReportService = async (sender, receiver, room_id, complain, url) => {
    try {
        console.log(complain);
        if (!await alreadyExistById(sender, User, "init_report_res")) {
            return false;
        };
        if (!await alreadyExistById(receiver, User, "init_report_res")) {
            return false;
        };
        if (!await alreadyExistById(room_id, Room, "init_report_res")) {
            return false;
        };

        const newReport = reportModeling(sender, receiver, room_id, complain, url);
        const docRef = await newReport.save();

        toEvent("init_report_res", { complain: docRef, status: true });
        return console.log('complain');
    } catch (err) {
        return io.to(socket.id).emit("init_report_res", { msg: 'Error initiating room', error: err, status: false });
    }
}

exports.getComplainsService = async (email, password, _id) => {
    try {
        const userCheck = await alreadyExistByEmail(email, "get_complains_res");
        if (!userCheck) {
            return console.log("get_complains_res");
        };
        if (!checkPassword(password, userCheck.password, "get_complains_res")) {
            return console.log("get_complains_res");
        };

        const sentComplains = Report.find({ sender: { $all: _id } });
        const recieveComplains = Report.find({ receiver: { $all: _id } });

        toEvent("get_complains_res", { sent: sentComplains, receive: recieveComplains, status: true })
        return console.log("get_complains_res");
    } catch (err) {
        err => io.to(id).emit("get_complains_res", { msg: "Error geting complains", error: err, status: false });
    }
}
