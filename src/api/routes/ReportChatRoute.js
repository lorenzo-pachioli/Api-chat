const { initReportController, getReportController } = require('../controller/ReportChatController');

exports.reportChatRoute = (socket) => {
    socket.on("init_report", data => initReportController(data));
    socket.on("get_report", data => getReportController(data));
}