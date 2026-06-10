/* const { isIdInteger } = require('./inputsValidator');
const { tokenValidator } = require('./tokenValidator');
const { response } = require('./response');

exports.isIdAndTokenValid = (req, res, next) => {
  const token = req.header('token');
  const id = req.params.id;
  const userId = tokenValidator(token);
  if (!userId) return response('Unauthorized', res, 401);
  if (!isIdInteger(id)) return response('Incorrect id number', res, 400);
  return next();
}

exports.isTokenValid = (req, res, next) => {
  const token = req.header('token');
  const userId = tokenValidator(token);
  if (!userId) return response('Unauthorized', res, 401);
  req.params.userId = userId;
  return next();
}
 */