const router = require('express').Router();
// prettier-ignore
const {
  getUsers, getUserById, createUser, updateUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserInfo);
module.exports = router;
