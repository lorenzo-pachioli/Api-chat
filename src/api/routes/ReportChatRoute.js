const { initReportController, getReportController } = require('../controler/ReportChatController');
const { errorCatch } = require('../helper/ErrorsUtils');

exports.reportChatRoute = (socket) => {
    socket.on("init_report", data => errorCatch(initReportController(data), "init_report"));
    socket.on("get_report", data => errorCatch(getReportController(data), "get_report"));
}