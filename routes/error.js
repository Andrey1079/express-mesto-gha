const router = require("express").Router();
const httpConstants = require('http2').constants
router.get("/", (req,res)=>{res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({message:"Указан не верный адрес"})})
router.post("/", (req,res)=>{res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({message:"Указан не верный адрес"})})
router.put("/", (req,res)=>{res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({message:"Указан не верный адрес"})})
router.delete("/", (req,res)=>{res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({message:"Указан не верный адрес"})})
router.patch("/", (req,res)=>{res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({message:"Указан не верный адрес"})})
module.exports = router