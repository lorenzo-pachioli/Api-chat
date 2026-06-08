let globalRes;
let globalNext;

exports.response = (msj, res, code, content = []) => {
  res.status(code).json({
    success: code === 200 ? true : false,
    message: msj,
    data: content
  });
  return true;
}

exports.logInResponse = (msj, res, code, token = '', user = {}) => {
  res.status(code).json({
    success: code === 200 ? true : false,
    message: msj,
    token,
    user
  });
  return true;
}

exports.next = (msj) => {
  return globalNext(msj);
}

exports.setRes = (newRes) => {
  globalRes = newRes;
}

exports.setNext = (newNext) => {
  globalNext = newNext;
}

exports.returnError = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
    data: []
  });
}

exports.serviceReturn = (msg, content, status) => {
  return {
    msg,
    content,
    status
  }
}
