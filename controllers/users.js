const httpConstants = require('http2').constants;
const { MongooseError } = require('mongoose');
const escape = require('escape-html');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../Errors/BadRequest');
const NotFound = require('../Errors/NotFound');
const Conflict = require('../Errors/Conflict');
const UnAuthorized = require('../Errors/UnAuthorized');

const { JWT_SECRET, NODE_ENV } = process.env;
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFound('такого пользователя не существует'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof MongooseError) {
        switch (err.statusCode) {
          case '400':
            next(new BadRequest(err.message));
            break;
          case '404':
            next(new NotFound(err.message));
            break;
          default:
        }
        if (err.name === 'CastError') {
          next(new BadRequest('не корректный id'));
          return;
        }
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  // prettier-ignore
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 16).then((hash) => {
    User.create({
      name: name && escape(name),
      about: about && escape(about),
      avatar: avatar && escape(avatar),
      email,
      password: hash,
    })
      .then((user) => {
        res.status(httpConstants.HTTP_STATUS_CREATED).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        });
      })

      .catch((err) => {
        if (err instanceof MongooseError) {
          next(new BadRequest(err.message));
          return;
        }
        if (err.code === 11000) {
          next(new Conflict('пользователь с таким email уже существует'));
          return;
        }
        next(err);
      });
  });
};

module.exports.updateUserInfo = (req, res, next) => {
  if (req.body.name) {
    req.body.name = escape(req.body.name);
  }
  if (req.body.about) {
    req.body.about = escape(req.body.about);
  }
  if (req.body.avatar) {
    req.body.avatar = escape(req.body.avatar);
  }
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof MongooseError) {
        next(new BadRequest(err.message));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : '123456789', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err instanceof MongooseError) {
        next(new UnAuthorized(err.message));
        return;
      }
      next(err);
    });
};

module.exports.getCurrentUserInfo = (req, res) => {
  User.findById(req.user._id).then((user) => res.status(200).send({ data: user }));
};
