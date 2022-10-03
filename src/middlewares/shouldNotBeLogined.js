const createHttpError = require('http-errors');

function shouldNotBeLogined(req, res, next) {
  const { user } = res.locals;

  if (!user) { next(); return; }
  next(createHttpError(403, 'should logout'));
}

module.exports = shouldNotBeLogined;
