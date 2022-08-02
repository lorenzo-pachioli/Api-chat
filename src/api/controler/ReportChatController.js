const { initReportService, getReportService } = require('../service/ReportChatService');
const { idValidate, emailValidate, passwordValidate } = require('../validate/syntaxCheck');

exports.initReportController = (data) => {
    const { sender, receiver, room_id, complain, url } = data;

    if (!idValidate(sender, "init_report_res") ||
        !idValidate(receiver, "init_report_res") ||
        !idValidate(room_id, "init_report_res")) {
        throw new Error("Incorrect id form");
    };

    initReportService(sender, receiver, room_id, complain, url);
}

exports.getReportController = (data) => {
    const { email, password, _id } = data;

    if (!emailValidate(email, "get_complains_res")) throw new Error("Incorrect email form");
    if (!passwordValidate(password, "get_complains_res")) throw new Error("Incorrect password form");
    if (!idValidate(otherUser, "get_complains_res")) throw new Error("Incorrect id form");

    getReportService(email, password, _id)
}
