const router = require('express').Router();
// prettier-ignore
const {
  getCards, createCard, deleteCard, setLike, deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', setLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
