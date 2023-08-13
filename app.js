const process = require('process');
require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const celebrateErrors = require('celebrate').errors;
const error = require('./middlewares/error');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 900000,
  max: 200,
});

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());

app.use('/', require('./routes/routes'));

app.use(celebrateErrors());
app.use(error);

app.listen(PORT);
