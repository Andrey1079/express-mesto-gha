const jwt = require('jsonwebtoken');
const UnAuthorized = require('../Errors/UnAuthorized');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAuthorized('Отсутсвует токен');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : '123456789');
  } catch (err) {
    next(new UnAuthorized('Токен не актуальный'));
  }
  req.user = payload;
  return next();
};
