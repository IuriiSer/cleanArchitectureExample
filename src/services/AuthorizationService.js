const createHttpError = require('http-errors');

const bcrypt = require('bcrypt');
const JwtService = require('./JwtService');
const Responce = require('../api/Responce');
const Converter = require('../lib/converter');
const Validator = require('../lib/validator');
const Interfaces = require('../interfaces');

class AuthorizationService {
  static async login(req, res, next) {
    try {
      const { nickname, password } = Converter.Authorization.apiGet(req.body);
      Validator.Authorization.checkNickname(nickname);
      Validator.Profile.checkPassword(password);
      const userAuthData = await Interfaces.User.getPassword({ nickname });
      const isTruePassword = await bcrypt.compare(`${password}${userAuthData.uuid}`, userAuthData.password);
      if (!isTruePassword) throw createHttpError(400, 'wrong password');
      const { accToken, refToken } = await JwtService.create({ user: userAuthData.uuid });
      Responce.session(
        { req, res, next },
        { toCookies: { refToken }, toSent: { token: accToken } },
      );
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
    try {
      Responce.ok({ req, res, next });
    } catch (err) {
      next(createHttpError(500, err));
    }
  }

  static async refreshAuthorization(req, res, next) {
    try {
      const { user } = res.locals;
      const { accToken, refToken } = await JwtService.create({ user });
      Responce.session(
        { req, res, next },
        { toCookies: { refToken }, toSent: { token: accToken } },
      );
    } catch (err) {
      next(createHttpError(500, err));
    }
  }
}

module.exports = AuthorizationService;
