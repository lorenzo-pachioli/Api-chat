const { initReportController, getReportController } = require('../controler/ReportChatController');
const { errorCatch } = require('../helper/ErrorsUtils');

exports.reportChatRoute = (socket) => {
    socket.on("init_report", data => errorCatch(initReportController(data)));
    socket.on("get_report", data => errorCatch(getReportController(data)));
}