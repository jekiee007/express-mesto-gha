const User = require('../models/user');

const ERROR_NOT_FOUND = 400;
const ERROR_ID_NOT_FOUND = 404;
const ERROR_SERVER = 500;

// GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      if (data) {
        res.send(data);
      }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } res.status(500).send({ message: 'Ошибка по умолчанию' });
    })
    .catch(next);
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((data) => {
      if (data) { res.send(data); }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ' Переданы некорректные данные при создании пользователя' });
      } res.status(500).send({ message: 'Ошибка по умолчанию' });
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
    })
    .catch(next);
};

// PATCH /users/me — обновляет профиль
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  })
    .then((data) => {
      if (data) { res.send(data); }
      if (!req.user._id) {
        return res.status(ERROR_ID_NOT_FOUND).send({ message: 'Id not found' });
      } if (!req.body) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Data error' });
      } return res.status(ERROR_SERVER).send({ message: 'Server error' });
    })
    .catch(next);
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((data) => {
      if (data) { res.send(data); }
      if (!req.user._id) {
        return res.status(ERROR_ID_NOT_FOUND).send({ message: 'Id not found' });
      } if (!req.body) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Data error' });
      } return res.status(ERROR_SERVER).send({ message: 'Server error' });
    })
    .catch(next);
};
