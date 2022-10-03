const createHttpError = require('http-errors');

function shouldBeLogined(req, res, next) {
  const { user } = res.locals;

  if (user) { next(); return; }
  next(createHttpError(403, 'should login'));
}

module.exports = shouldBeLogined;
