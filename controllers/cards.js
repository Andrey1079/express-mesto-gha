const Card = require("../models/card");
const {isValidObjectId}=require('mongoose')
const httpConstants = require('http2').constants

module.exports.getCards = (req, res) => {
  Card.find({})
  .populate("owner")
  .populate("likes")
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "На сервере произошла ошибка" })
    });
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const createdAt = new Date();
  Card.create({ name, link, owner: req.user._id, createdAt })
    .then((card) => res.send({ data: card }))
    .catch((err) =>{
      if (err.name ==="ValidationError" ){
       res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({message:"Переданы некорректные данные"})
      }else
      {res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "На сервере произошла ошибка" })}
    });
 };
module.exports.deleteCard = (req, res) => {
  if (isValidObjectId(req.params.cardId))
  {Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {{if(card){res.send(`карточка ${card} удалена`)}else{
      res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({message:`Карточка с id:${req.params.cardId} не найдена`});return
    }}})
    .catch(() => {
      res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "На сервере произошла ошибка" });
    });}else{
      res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({message:"Передан некорректный id карточки"});
    }
};
module.exports.setLike = (req, res) => {
  if (isValidObjectId(req.params.cardId))
  {Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
  .populate("owner")
  .populate("likes")
    .then((card) => {
      if(card)
      {res.send(card)}else{
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({message:`Карточка с id:${req.params.cardId} не найдена`});return
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    })}else{res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({message:"Передан некорректный id карточки"});}
};
module.exports.deleteLike = (req, res) => {
  if (isValidObjectId(req.params.cardId))
  {Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
  .populate("owner")
  .populate("likes")
    .then((card) => {
      if(card)
      {res.send(card)}else{
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({message:`Карточка с id:${req.params.cardId} не найдена`});return
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    })}else{res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({message:"Передан некорректный id карточки"});}
};
