const jwt = require('jsonwebtoken');
const UnAuthorized = require('../Errors/UnAuthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(new UnAuthorized(err.message));
  }
  req.user = payload;
  return next();
};
