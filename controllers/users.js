const User = require('../models/user');

const ERROR_NOT_FOUND = 404;
const ERROR_ID_NOT_FOUND = 400;

// GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw res.status(ERROR_ID_NOT_FOUND).send({ message: 'Id not found' });
      }
      res.send(data);
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
      if (!data) {
        throw res.status(ERROR_NOT_FOUND).send({ message: 'Incorrected data' });
      }
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
      if (!data) {
        throw res.status(ERROR_NOT_FOUND).send({ message: 'Incorrected data' });
      }
      res.send(data);
    })
    .catch(next);
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((data) => {
      if (!data) {
        throw res.status(ERROR_NOT_FOUND).send({ message: 'Incorrected data' });
      }
      res.send(data);
    })
    .catch(next);
};
