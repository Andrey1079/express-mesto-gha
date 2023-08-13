const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants;

module.exports = (err, req, res, next) => {
  const {
    statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR,
    message = 'на сервере произошла ошибка',
  } = err;
  res.status(statusCode).send({ message: message }); // eslint-disable-line
  next();
};
