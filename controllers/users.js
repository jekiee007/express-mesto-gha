const User = require('../models/user');

const ERROR_NOT_FOUND = 400;
const ERROR_ID_NOT_FOUND = 404;
const ERROR_SERVER = 500;

// GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
      }
    })
    .catch(next);
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else res.status(ERROR_ID_NOT_FOUND).send({ message: 'Пользователь с таким Id не найден' });
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с таким Id не найден' });
      }
    })
    .catch(next);
};

// POST /users — создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные' });
      }
    })
    .catch(next);
};

// PATCH /users/me — обновляет профиль
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные' });
      } res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию' });
    })
    .catch(next);
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (!req.user._id) {
          res.status(ERROR_ID_NOT_FOUND).send({ message: 'Пользователь с таким Id не найден' });
        }
        if (!req.body) {
          res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные' });
        } res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    })
    .catch(next);
};
