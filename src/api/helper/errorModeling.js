
exports.newError = (msj, code) => {
  const newError = new Error(msj)
  newError.statusCode = code;
  return newError;
}
