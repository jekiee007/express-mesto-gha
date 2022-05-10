const Card = require('../models/card');

// const ERROR_NOT_FOUND = 400;
// const ERROR_ID_NOT_FOUND = 404;
// const ERROR_SERVER = 500;

// GET /cards — возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

// POST /cards — создаёт карточку
module.exports.createCard = (req, res, next) => {
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
      console.log(err.name);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ' Переданы некорректные данные при создании карточки' });
      }
    })
    .catch(next);
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndDelete({
    _id: req.params.cardId,
    owner: req.user._id,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка с таким Id не найдена' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
      }
    })
    .catch(next);
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((data) => {
  if (data != null) {
    res.send(data);
  } else res.status(400).send({ message: 'Карточка с таким Id не найдена' });
})
  .catch((err) => {
    console.log(err.name);
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Карточка с таким Id не найдена' });
    }
  })
  .catch(next);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((data) => {
  if (data != null) {
    res.send(data);
  } else res.status(400).send({ message: 'Карточка с таким Id не найдена' });
})
  .catch((err) => {
    console.log(err.name);
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Карточка с таким Id не найдена' });
    }
  })
  .catch(next);
