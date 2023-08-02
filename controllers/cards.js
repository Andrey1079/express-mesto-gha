const httpConstants = require('http2').constants;
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const createdAt = new Date();
  Card.create({
    name,
    link,
    owner: req.user._id,
    createdAt,
  })
    .then((card) => res.status(httpConstants.HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('idNotFound'))
    .then(() => res.send({ message: 'Пост удален' }))
    .catch((err) => {
      if (err.message === 'idNotFound') {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с id:${req.params.cardId} не найдена` });
        return;
      }
      if (err.name === 'CastError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.setLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('idNotFound'))
    .populate('owner')
    .populate('likes')
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'idNotFound') {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с id:${req.params.cardId} не найдена` });
        return;
      }
      if (err.name === 'CastError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .populate('likes')
    .orFail(new Error('idNotFound'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'idNotFound') {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с id:${req.params.cardId} не найдена` });
        return;
      }
      if (err.name === 'CastError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
