const { initReportService, getReportService } = require('../service/ReportChatService');

exports.initReportController = (data) => {
    const {sender, receiver, room_id, complain, url} = data;
    initReportService(sender, receiver, room_id, complain, url);
}

exports.getReportController = (data) => {
    const {email, password, _id} = data;
    getReportService(email, password, _id)
}