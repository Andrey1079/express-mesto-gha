const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено '],
      minlength: [2, 'Минимальная длина поля "name" -2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" -30 символа'],
    },
    link: {
      type: String,
      validate: { validator: (v) => validator.isURL(v), message: 'Некорректный URL' },
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    createdAt: {
      type: Date,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
