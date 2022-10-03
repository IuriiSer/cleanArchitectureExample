const jwt = require('jsonwebtoken');
const tokenModel = require('../../db/models/token');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '31d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(user_id, refreshToken) {
    const tokenData = await tokenMode.findOne({ user: user_id });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: user_id, refreshToken });
    return token;
  }
}

module.exports = new TokenService();
