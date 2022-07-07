const { initReportService, getReportService } = require('../service/ReportChatService');
const { idValidate, emailValidate, passwordValidate } = require('../validate/syntaxCheck');

exports.initReportController = (data) => {
    const { sender, receiver, room_id, complain, url } = data;

    if (!idValidate(sender, "init_report_res") || !idValidate(receiver, "init_report_res") || !idValidate(room_id, "init_report_res")) {
        return false;
    };

    initReportService(sender, receiver, room_id, complain, url);
}

exports.getReportController = (data) => {
    const { email, password, _id } = data;

    if (!emailValidate(email, "get_complains_res") || !passwordValidate(password, "get_complains_res")) {
        return false;
    };
    if (!idValidate(otherUser, "get_complains_res")) {
        return false;
    };

    getReportService(email, password, _id)
}
