const { newError } = require('../helper/errorModeling');
const { response } = require('../helper/response');

exports.HealthCheckController = async (req, res, next) => {
  try {
    return response('API-Chat is running', res, 200);
  } catch (err) {
    next(newError(`Health check failed`, 500));
  }
};

