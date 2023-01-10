const { toEvent } = require('../helper/SocketUtils');
const { initReportService, getReportService } = require('../service/ReportChatService');
const { roomExistByIdService } = require('../service/RoomService');
const { userExistService } = require('../service/UserService');
const { idValidate, emailValidate, passwordValidate } = require('../validate/syntaxCheck');
const { validateUser } = require('./UserController');

exports.initReportController = async (data) => {
    const { sender, receiver, room_id, complain, url } = data;

    if (!idValidate(sender, "init_report_res")) throw new Error("Incorrect sender id form");
    if (!idValidate(receiver, "init_report_res")) throw new Error("Incorrect receiver id form");
    if (!idValidate(room_id, "init_report_res")) throw new Error("Incorrect room id form");

    if (!await userExistService(sender)) throw new Error("Must be registered to initiate a chat report");
    if (!await userExistService(receiver)) throw new Error("The user you're reporting doesn't exist");
    if (!await roomExistByIdService(room_id)) throw new Error("The chat you're reporting doesn't exist");

    const reportCreated = await initReportService(sender, receiver, room_id, complain, url)
    toEvent("init_report_res", reportCreated);
}

exports.getReportController = async (data) => {
    const { email, password } = data;

    if (!emailValidate(email, "get_complains_res")) throw new Error("Incorrect email form");
    if (!passwordValidate(password, "get_complains_res")) throw new Error("Incorrect password form");

    const userCheck = await validateUser(email, password);
    const report = await getReportService(userCheck._id)
    toEvent("get_complains_res", report);
}
