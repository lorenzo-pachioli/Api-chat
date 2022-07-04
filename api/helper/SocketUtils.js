var mySocket = {};
var myIo = {};

module.exports.toEvent = (eventName, statusObj) => {
    myIo.to(mySocket.id).emit(eventName, statusObj);
}

module.exports.brodcastEvent = (eventName, statusObj) => {
    myIo.broadcast.emit(eventName, statusObj);
}
module.exports.socketsEvent = (eventName, statusObj) => {
    myIo.sockets.emit(eventName, statusObj)
}

module.exports.socketsEvent = (id, eventName, statusObj) => {
    myIo.sockets.in(id).emit(eventName, statusObj);
}

module.exports.initSocket = (io, socket) => {
    myIo = io;
    mySocket = socket;
}

module.exports.disconnectSocket = (boolean) => {
    if (mySocket.connected) {
        return mySocket.disconnect(boolean);
    }
}

module.exports.joinRoom = (roomId) => {
    return mySocket.join(roomId.toString())
}