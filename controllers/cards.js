const httpConstants = require('http2').constants;
const { MongooseError } = require('mongoose');
const escape = require('escape-html');

const Card = require('../models/card');
const BadRequest = require('../Errors/BadRequest');
const Forbiden = require('../Errors/Forbiden');
const NotFound = require('../Errors/NotFound');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const createdAt = new Date();
  Card.create({
    name: escape(name),
    link: escape(link),
    owner: req.user._id,
    createdAt,
  })
    .then((card) => res.status(httpConstants.HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof MongooseError) {
        next(new BadRequest(err.message));
        return;
      }
      next(err);
    });
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFound('такой карточки не существует'))
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.send({ message: 'Пост удален' }))
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
            }

            next(err);
          });
      } else {
        throw new Forbiden('у вас нет прав на удаление данной карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('не корректный id'));
        return;
      }
      next(err);
    });
};

module.exports.setLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFound('такой карточки не существует'))
    .populate('owner')
    .populate('likes')
    .then((card) => {
      res.send(card);
    })
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
module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .populate('likes')
    .orFail(new NotFound('такой карточки не существует'))
    .then((card) => {
      res.send(card);
    })
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
