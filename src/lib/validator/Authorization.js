const Interfaces = require('../../interfaces');

const { USER_NICKNAME_LENGTH_MIN, USER_NICKNAME_LENGTH } = process.env;

class Authorization {
  static async checkNickname(nickname) {
    try {
      if (typeof nickname !== 'string') throw new Error('nickname is not a string');
      if (nickname.length < USER_NICKNAME_LENGTH_MIN) throw new Error('short nickname');
      if (nickname.length > USER_NICKNAME_LENGTH) throw new Error('long nickname');
      const isExist = await Interfaces.User.isExist({ nickname });
      if (!isExist) throw new Error('nickname doesn`t exist');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }
}
module.exports = Authorization;
