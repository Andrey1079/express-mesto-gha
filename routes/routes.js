const router = require('express').Router();
const auth = require('../middlewares/auth');

router.post('/signin', require('./signIn'));
router.post('/signup', require('./signUp'));

router.use(auth);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));
router.use('*', require('./error'));

module.exports = router;
