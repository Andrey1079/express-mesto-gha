const { isValidObjectId } = require("mongoose");
const User = require("../models/user");
const httpConstants = require('http2').constants;
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "На сервере произошла ошибка" })
    });
};
module.exports.getUserById = (req, res) => {
if(isValidObjectId(req.params.userId))
{  User.findById(req.params.userId)
    .then((user) => {
      
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError"){
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({message:"Пользователь не найден"})
      }else
      {res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "На сервере произошла ошибка" });}
    })}else{
      res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({message:"Передан не корректный Id пользователя"})
    }
};


module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) =>{
     if (err.name ==="ValidationError" ){
      res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({message:"Переданы некорректные данные"})
     }
else
   { res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "На сервере произошла ошибка" })}
  })
};
module.exports.updateUserInfo = (req, res) => {
  if (typeof req.body!=="object" ||Object.keys(req.body).length<1){//проверка на валидность данных, так как в req.body 
    // можно передать любой тип данных и это не приводит к ошибке ValidationError
    res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({message:"1Переданы некорректные данные"})
  }else
{  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators:true })
    .then((user) => res.send({ data: user }))
    .catch((err) =>{
      if (err.name ==="ValidationError" ){
       res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({message:"Переданы некорректные данные"}); return
      }
 else
    { res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "На сервере произошла ошибка" })}
   })}
 };
