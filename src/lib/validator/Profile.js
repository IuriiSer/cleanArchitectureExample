const validator = require('validator');

const Interfaces = require('../../interfaces');

const {
  USER_NICKNAME_LENGTH_MIN, USER_NICKNAME_LENGTH, USER_AGE_MAX, USER_AGE_MIN,
  USER_ABOUT_LENGTH, USER_HOBBIES_LENGTH, USER_NAME_LENGTH,
} = process.env;

class Validator {
  static async checkEmail(email) {
    try {
      if (!email) throw new Error('email is enpty');
      if (typeof email !== 'string') throw new Error('email is not a string');
      if (!validator.isEmail(email)) throw new Error('wrong email format');
      const isExist = await Interfaces.User.isExist({ email });
      if (isExist) throw new Error('email exist');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async checkNickname(nickname) {
    try {
      if (!nickname) throw new Error('nickname is enpty');

      if (typeof nickname !== 'string') throw new Error('nickname is not a string');
      if (nickname.length < USER_NICKNAME_LENGTH_MIN) throw new Error('short nickname');
      if (nickname.length > USER_NICKNAME_LENGTH) throw new Error('long nickname');
      const isExist = await Interfaces.User.isExist({ nickname });
      if (isExist) throw new Error('nickname exist');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static checkAge(age) {
    try {
      if (!age) throw new Error('age is enpty');

      if (typeof age !== 'number') throw new Error('age is not a number');
      if (age < USER_AGE_MIN) throw new Error('only for adult');
      if (age > USER_AGE_MAX) throw new Error('only for alive');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static checkAbout(about) {
    try {
      if (!about) throw new Error('about is enpty');

      if (about > USER_ABOUT_LENGTH) throw new Error('too long about');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static checkHobbies(hobbies) {
    try {
      if (!hobbies) throw new Error('hobbies is enpty');

      if (hobbies > USER_HOBBIES_LENGTH) throw new Error('too long hobbies');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static checkName(name) {
    try {
      if (!name) throw new Error('name is enpty');

      if (name > USER_NAME_LENGTH) throw new Error('too long hobbies');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static checkPassword(password) {
    try {
      if (!password) throw new Error('password is enpty');

      if (typeof password !== 'string') throw new Error('password is not a string');
      if (!validator.isStrongPassword(password, { minLength: 8 })) throw new Error('password is not strong');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async checkAllPossible(data) {
    try {
      if (!Object.keys(data).length) throw new Error('input is empty');
      const {
        email, nickname, age, about, hobbies, name, password,
      } = data;
      const validateOrder = [];

      if (email) validateOrder.push(Validator.checkEmail(email));
      if (nickname) validateOrder.push(Validator.checkNickname(nickname));
      if (age) validateOrder.push(Validator.checkAge(age));
      if (hobbies) validateOrder.push(Validator.checkHobbies(hobbies));
      if (about) validateOrder.push(Validator.checkAbout(about));
      if (name) validateOrder.push(Validator.checkName(name));
      if (password) validateOrder.push(Validator.checkPassword(password));

      await Promise.all(validateOrder);
    } catch (err) {
      throw Error(err.message);
    }
  }
}

module.exports = Validator;
