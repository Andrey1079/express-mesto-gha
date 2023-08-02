const httpConstants = require('http2').constants;
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('idNotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'idNotFound') {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан не корректный id' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
module.exports.updateUserInfo = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
