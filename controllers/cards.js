const Card = require('../models/card');

const {
  ERROR_NOT_FOUND,
  ERROR_ID_NOT_FOUND,
  ERROR_SERVER,
} = require('../utils/constants');

// GET /cards — возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

// POST /cards — создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
      }
    });
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete({
    _id: req.params.cardId,
  })
    .then((data) => {
      if (data != null) {
        res.send(data);
      } else {
        res.status(ERROR_ID_NOT_FOUND).send({ message: 'Переданы некорректные данные при удалении карточки' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким Id не найдена' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
      }
    });
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((data) => {
  if (data != null) {
    res.send(data);
  } else {
    res.status(ERROR_ID_NOT_FOUND).send({ message: 'Карточка с таким Id не найдена' });
  }
})
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким Id не найдена' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    }
  });

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((data) => {
  if (data != null) {
    res.send(data);
  } else {
    res.status(ERROR_ID_NOT_FOUND).send({ message: 'Карточка с таким Id не найдена' });
  }
})
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким Id не найдена' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    }
  });
