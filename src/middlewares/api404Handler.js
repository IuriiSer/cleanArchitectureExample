const createHttpError = require('http-errors');

module.exports = function api404Handler(req, res, next) {
  next(createHttpError(404, 'api doesn`t exist'));
};
