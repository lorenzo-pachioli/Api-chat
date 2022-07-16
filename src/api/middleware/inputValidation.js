

module.exports.userValidationMiddleware = (socket) => {
    socket.use((packet, next) => {
            console.log(packet);
            const {firstName, lastName, email, password, otherUser, online } = packet[1];
            console.log(firstName, lastName, email, password, otherUser, online);
            next();
    });
}

module.exports.roomValidationMiddleware = (socket) => {
    socket.use((packet, next) => {
            const {_id, otherUser, room_id, message_id, message } = packet[1];
            console.log(_id, otherUser, room_id, message_id, message);
            next();
    });
}