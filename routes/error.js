const httpConstants = require('http2').constants;
const router = require('express').Router();

router.all('/', (req, res) => {
  res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Указан не верный адрес' });
});

module.exports = router;
