const router = require('express').Router();
// prettier-ignore
const {
  getUsers, getUserById, updateUserInfo, getCurrentUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUserInfo);
router.get('/:userId', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserInfo);
module.exports = router;
