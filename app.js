const process = require('process');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});
app.use(helmet());
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = { _id: '64c753bc6282bdab39f21481' };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('*', require('./routes/error'));

app.listen(PORT);
