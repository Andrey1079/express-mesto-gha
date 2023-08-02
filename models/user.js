const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено '],
      minlength: [2, 'Минимальная длина поля "name" -2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" -30 символа'],
    },
    about: {
      type: String,
      required: [true, 'Поле "about" должно быть заполнено '],
      minlength: [2, 'Минимальная длина поля "about" -2 символа'],
      maxlength: [30, 'Максимальная длина поля "about" -30 символа'],
    },
    avatar: {
      type: String,
      validate: { validator: (v) => validator.isURL(v), message: 'Некорректный URL' },
      required: true,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
