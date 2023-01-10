const Report = require('../models/Report');
const { reportModeling } = require('../helper/ModelUtils');

exports.initReportService = async (sender, receiver, room_id, complain, url) => {

    const newReport = reportModeling(sender, receiver, room_id, complain, url);
    const docRef = await newReport.save();
    return { complain: docRef, status: true };
}

exports.getComplainsService = async (_id) => {

    const sentComplains = await Report.find({ sender: { $all: _id } });
    const recieveComplains = await Report.find({ receiver: { $all: _id } });
    return { sent: sentComplains, receive: recieveComplains, status: true };
}
