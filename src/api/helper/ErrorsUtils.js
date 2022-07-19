const { toEvent } = require('./SocketUtils');

module.exports.errorCatch = (fn, eventName) => {
    Promise.resolve(fn).catch(err => {
        console.log('error:', err)
        toEvent(`${eventName}_res`, { msg: `Something went wrong during ${eventName}`, error: err.message, status: false });
    })
}