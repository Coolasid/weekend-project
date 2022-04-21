const { verifyToken } = require('../utils/jwt');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization)
    throw { message: 'Token is not provided! Please login ' };
  const bearerToken = req.headers.authorization;
  if (!bearerToken) throw { message: 'Token is not provided! Please login ' };
  const token = bearerToken.split(' ')[1];
  try {
    var user = await verifyToken(token);
  } catch (error) {
    throw { message: 'token is not valid' };
  }
  req.user = user.user;
  next();
};
