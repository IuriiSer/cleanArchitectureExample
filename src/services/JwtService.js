const jwt = require('jsonwebtoken');

const { TOKEN_SECRET, TOKEN_REF_ALIVE, TOKEN_ACC_ALIVE } = process.env;

const Interfaces = require('../interfaces');

const { Token } = require('../../db/models');

class JwtService {
  /**
   * @param { uuidV4 } payload
   * @returns { accToken, refToken }
   */
  static async create(payload) {
    try {
      const accToken = jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_ACC_ALIVE / 1000 });
      const refToken = jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_REF_ALIVE / 1000 });
      const userData = await Interfaces.User.get(payload.user);
      if (!userData) return { accToken: `Bearer ${accToken}`, refToken };
      if (userData.isNotInDb) return { accToken: `Bearer ${accToken}`, refToken };
      const [token, created] = await Token.findOrCreate({
        where: { user: payload.user },
        defaults: {
          refToken,
        },
      });
      if (!created) {
        await token.update({ refToken });
      }
      return { accToken: `Bearer ${accToken}`, refToken };
    } catch (err) {
      throw Error(err.message);
    }
  }

  static validate(token) {
    try {
      const data = jwt.verify(token, process.env.TOKEN_SECRET);
      return data;
    } catch (err) {
      throw Error('expired accToken');
    }
  }
}

module.exports = JwtService;
