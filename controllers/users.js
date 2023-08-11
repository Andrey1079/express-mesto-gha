const httpConstants = require('http2').constants;
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан не корректный id1' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  // prettier-ignore
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 16).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
        } else {
          res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
        }
      });
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: 3600 });
      res.status(200).send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getCurrentUserInfo = (req, res) => {
  User.findById(req.user._id).then((user) => res.status(200).send({ data: user }));
};
