const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlPattern = require('../utils/constants');
// prettier-ignore
const {
  getCards, createCard, deleteCard, setLike, deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().pattern(urlPattern),
      })
      .unknown(true),
  }),
  createCard,
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().required().alphanum().length(24) }),
  }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().required().alphanum().length(24) }),
  }),
  setLike,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().required().alphanum().length(24) }),
  }),
  deleteLike,
);

module.exports = router;
