/* const jwt = require('jsonwebtoken');

exports.tokenValidator = (token) => {

  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const verified = jwt.verify(token, jwtSecretKey);
    return verified ? verified.userId : null;

  } catch (error) {
    return null;
  }
} */
