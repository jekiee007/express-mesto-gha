const Card = require('../models/card');

const ERROR_NOT_FOUND = 400;
const ERROR_ID_NOT_FOUND = 404;
const ERROR_SERVER = 500;

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
    .catch(() => {
      if (!req.params._id) {
        return res.status(ERROR_ID_NOT_FOUND).send({ message: 'Id not found' });
      } if (!req.body) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Data error' });
      } return res.status(ERROR_SERVER).send({ message: 'Server error' });
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
    .catch(() => {
      if (!req.params._id) {
        return res.status(ERROR_ID_NOT_FOUND).send({ message: 'Id not found' });
      } if (!req.body) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Data error' });
      } return res.status(ERROR_SERVER).send({ message: 'Server error' });
    })
    .catch(next);
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((data) => {
  res.send(data);
})
  .catch(() => {
    if (!req.params._id) {
      return res.status(ERROR_ID_NOT_FOUND).send({ message: 'Id not found' });
    } if (!req.body) {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Data error' });
    } return res.status(ERROR_SERVER).send({ message: 'Server error' });
  })
  .catch(next);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((data) => {
  res.send(data);
})
  .catch(() => {
    if (!req.params._id) {
      return res.status(ERROR_ID_NOT_FOUND).send({ message: 'Id not found' });
    } if (!req.body) {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Data error' });
    } return res.status(ERROR_SERVER).send({ message: 'Server error' });
  })
  .catch(next);
