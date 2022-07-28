const Report = require('../models/Report');
const Room = require('../models/Room');
const User = require('../models/User');
const { reportModeling } = require('../helper/ModelUtils');
const { toEvent } = require('../helper/SocketUtils');
const { alreadyExistById, alreadyExistByEmail, checkPassword } = require('../validate/dbCheck');

exports.initReportService = async (sender, receiver, room_id, complain, url) => {
    if (!await alreadyExistById(sender, User)) throw new Error("Must be registered to initiate a chat report");
    if (!await alreadyExistById(receiver, User)) throw new Error("The user you're reporting doesn't exist");
    if (!await alreadyExistById(room_id, Room)) throw new Error("The chat you're reporting doesn't exist");

    const newReport = reportModeling(sender, receiver, room_id, complain, url);
    const docRef = await newReport.save();

    toEvent("init_report_res", { complain: docRef, status: true });
}

exports.getComplainsService = async (email, password) => {
    const userCheck = await alreadyExistByEmail(email);
    if (!userCheck) throw new Error("Must be registered to get chat reports");
    if (!checkPassword(password, userCheck.password)) throw new Error("Wrong password");

    const sentComplains = Report.find({ sender: { $all: userCheck._id } });
    const recieveComplains = Report.find({ receiver: { $all: userCheck._id } });

    toEvent("get_complains_res", Promise.resolve({ sent: sentComplains, receive: recieveComplains, status: true }))
}
