const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlPattern = require('../utils/constants');

// prettier-ignore
const {
  getUsers, getUserById, updateUserInfo, getCurrentUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUserInfo);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfo,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(urlPattern),
    }),
  }),
  updateUserInfo,
);
module.exports = router;
