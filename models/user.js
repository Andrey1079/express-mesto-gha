const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const UnAuthorized = require('../Errors/UnAuthorized');

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
      unique: true,
      required: [true, 'Поле email должно быть заполнено'],
      validate: { validator: (v) => validator.isEmail(v), message: 'Не корректный Email' },
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Поле "password" должно быть заполнено '],
    },
  },
  { versionKey: false },
);
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnAuthorized('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnAuthorized('Неправильные почта или пароль');
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
