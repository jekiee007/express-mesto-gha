const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ERROR_NOT_FOUND,
  ERROR_ID_NOT_FOUND,
  ERROR_SERVER,
} = require('../utils/constants');

// GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    });
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else res.status(ERROR_ID_NOT_FOUND).send({ message: 'Пользователь с таким Id не найден' });
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с таким Id не найден' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
      }
    });
};

// POST /users — создаёт пользователя
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

// PATCH /users/me — обновляет профиль
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
