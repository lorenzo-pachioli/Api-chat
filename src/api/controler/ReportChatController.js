const { initReportService, getReportService } = require('../service/ReportChatService');
const { idValidate, emailValidate, passwordValidate } = require('../validate/syntaxCheck');

exports.initReportController = (data) => {
    const { sender, receiver, room_id, complain, url } = data;

    if (!idValidate(sender, "init_report_res")) throw new Error("Incorrect sender id form");
    if (!idValidate(receiver, "init_report_res")) throw new Error("Incorrect receiver id form");
    if (!idValidate(room_id, "init_report_res")) throw new Error("Incorrect room id form");

    initReportService(sender, receiver, room_id, complain, url);
}

exports.getReportController = (data) => {
    const { email, password } = data;

    if (!emailValidate(email, "get_complains_res")) throw new Error("Incorrect email form");
    if (!passwordValidate(password, "get_complains_res")) throw new Error("Incorrect password form");

    getReportService(email, password)
}
