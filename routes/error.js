const router = require('express').Router();
const NotFound = require('../Errors/NotFound');

router.all('/', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

module.exports = router;
