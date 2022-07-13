const {toEvent} = require('./SocketUtils');

module.exports.errorCatch = (fn, eventName) => {
    Promise.resolve(fn).catch(err => {
        const error = {
            'code': err.code,
            'errno': err.errno,
            'message': err.message,
        }
        console.log('error:', err)
        toEvent(`${eventName}_res`, { msg: `Something went wrong during ${eventName}` , status: false });
    })
}