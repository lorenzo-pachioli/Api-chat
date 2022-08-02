let mySocket = {};
let myIo = {};
let event = '';

exports.toEvent = (eventName, statusObj) => {
    if (eventName) {
        myIo.to(mySocket.id).emit(eventName, statusObj);
    }
    myIo.to(mySocket.id).emit(`${event}_res`, statusObj);
}

exports.brodcastEvent = (eventName, statusObj) => {
    myIo.broadcast.emit(eventName, statusObj);
}
exports.socketsEvent = (eventName, statusObj) => {
    myIo.sockets.emit(eventName, statusObj)
}

exports.socketsInEvent = (id, eventName, statusObj) => {
    myIo.sockets.in(id.toString()).emit(eventName, statusObj);
}

exports.initSocket = (io, socket) => {
    socket.prependAny((eventName)=>{
        myIo = io;
        mySocket = socket;
        event = eventName;
    });
    myIo = io;
    mySocket = socket;
}

exports.disconnectSocket = (boolean) => {
    if (mySocket.connected) {
        return mySocket.disconnect(boolean);
    }
}

exports.joinRoom = (roomId) => {
    return mySocket.join(roomId.toString())
}
