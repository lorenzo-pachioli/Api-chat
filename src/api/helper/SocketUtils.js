let mySocket = {};
let myIo = {};
let event = '';

exports.toEvent = (eventName, statusObj) => {
    if (eventName) {
        myIo.to(mySocket.id).emit(eventName, statusObj);
    }
    myIo.to(mySocket.id).emit(`${event}_res`, statusObj);
}

exports.socketsEvent = (eventName, statusObj) => {
    if (!eventName) throw new Error('No event name recive');
    myIo.sockets.emit(eventName, statusObj ? statusObj:'')
}

exports.socketsInEvent = (id, eventName, statusObj) => {
    if (!id || !eventName) throw new Error('Not enought info to emit event');
    myIo.sockets.in(id.toString()).emit(eventName, statusObj ? statusObj:'');
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

exports.disconnectSocket = () => {
    if (mySocket.connected) {
        return mySocket.disconnect();
    }
    return false;
}

exports.joinRoom = (roomId) => {
    return mySocket.join(roomId.toString())
}
