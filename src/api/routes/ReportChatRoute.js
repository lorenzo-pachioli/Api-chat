const { initReportController, getReportController } = require('../controler/ReportChatController');

exports.reportChatRoute = (socket) => {
    socket.on("init_report", data => initReportController(data));
    socket.on("get_report", data => getReportController(data));
}