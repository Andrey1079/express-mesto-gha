const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина поля "name" -2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" -30 символа'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина поля "about" -2 символа'],
      maxlength: [30, 'Максимальная длина поля "about" -30 символа'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: { validator: (v) => validator.isURL(v), message: 'Некорректный URL' },
    },
    email: {
      type: String,
      required: [true, 'Поле email должно быть заполнено'],
      validate: { validator: (v) => validator.isEmail(v), message: 'Не корректный Email' },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено '],
      minlength: [8, 'Минимальная длина поля "about" -8 символа'],
      maxlength: [256, 'Максимальная длина поля "about" -256 символа'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
