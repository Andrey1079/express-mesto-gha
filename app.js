const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const process = require('process')
const { PORT = 3000 } = process.env;
const app = express();
mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => console.log("monogo is connected"))
  .catch((err) => console.log("ОШИБКА ПОДКЛЮЧЕНИЯ!", err.message));
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = { _id: "64c753bc6282bdab39f21481" };
  next();
});
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));
app.listen(PORT, () => console.log("server is on"));
