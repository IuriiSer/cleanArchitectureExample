const createHttpError = require('http-errors');
const JwtService = require('./JwtService');
const Interfaces = require('../interfaces');

const { Token } = require('../../db/models');

class ConnectionsService {
  static async initClientConnectionMiddleware(req, res, next) {
    try {
      const user = await ConnectionsService.initClientConnection(req);
      if (user) res.locals.user = user;
      next();
    } catch (err) {
      next(createHttpError(401, err.message));
    }
  }

  static async initClientConnection(req) {
    try {
      if (!req.headers.authorization) { return null; }
      const [type, accToken] = req.headers.authorization.split(' ');
      if (type !== 'Bearer') { return null; }
      const decoded = JwtService.validate(accToken);
      return decoded.user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async shouldHaveRefTokenMiddleware(req, res, next) {
    try {
      if (!req.session?.user) { next(createHttpError(403, 'no session')); return; }
      const { refToken } = req.session.user;
      const { user } = JwtService.validate(refToken);
      const userByToken = await Token.findOne({ where: { refToken }, raw: true });
      if (!userByToken) {
        const userData = await Interfaces.User.get(user);
        if (!userData) { next(createHttpError(400, 'user doesn`t exist')); return; }
        if (userData.justRegistrated || userData.isNotInDb) {
          res.locals.user = user;
          next(); return;
        }
        next(createHttpError(400, 'wrong token')); return;
      }
      const owner = userByToken.user;
      if (user !== owner) { next(createHttpError(400, 'wrong token')); return; }
      res.locals.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ConnectionsService;
