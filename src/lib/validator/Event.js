const {
  EVENT_TITLE_LENGTH, EVENT_DESCRIPTION_LENGTH, EVENT_COORDINATES_LENGTH,
} = process.env;

const Common = require('./Common');

class Validator {
  static checkInfo(info) {
    try {
      if (typeof info !== 'object') throw new Error('info is not an object');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static checkTitle(title) {
    try {
      if (typeof title !== 'string') throw new Error('title is not a string');
      if (!title.length) throw new Error('title is empty');
      if (title.length >= EVENT_TITLE_LENGTH) throw new Error('title is too long');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static checkDescription(descriprtion) {
    try {
      if (typeof descriprtion !== 'string') throw new Error('descriprtion is not a string');
      if (!descriprtion.length) throw new Error('descriprtion is empty');
      if (descriprtion.length >= EVENT_DESCRIPTION_LENGTH) throw new Error('descriprtion is too long');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static checktimeBeg(timeBeg) {
    try {
      Common.checkNumber(timeBeg, 'timeBeg');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static checkTimeEnd(timeEnd) {
    try {
      Common.checkNumber(timeEnd, 'timeEnd');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static checkType(type) {
    try {
      if (!type) throw new Error('wrong type');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static checkCoordinates(coordinates) {
    try {
      if (typeof coordinates !== 'string') throw new Error('coordinates is not a string');
      if (coordinates.length >= EVENT_COORDINATES_LENGTH) throw new Error('coordinates is too long');
      if (coordinates.split(',').length !== 2 || coordinates.split('.').length !== 3) throw new Error('coordinates have wrong format');
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async checkAllPossible(data) {
    try {
      if (!Object.keys(data).length === 1 && data.event) throw new Error('input is empty');
      const {
        info, title, descriprtion, timeBeg, timeEnd, coordinates, type,
      } = data;
      const validateOrder = [];

      if (info) validateOrder.push(Validator.checkInfo(info));
      if (title) validateOrder.push(Validator.checkTitle(title));
      if (descriprtion) validateOrder.push(Validator.checkDescription(descriprtion));
      if (timeBeg || Number.isNaN(timeBeg)) {
        validateOrder.push(Validator.checktimeBeg(timeBeg));
      }
      if (timeEnd || Number.isNaN(timeEnd)) validateOrder.push(Validator.checkTimeEnd(timeEnd));
      if (coordinates) validateOrder.push(Validator.checkCoordinates(coordinates));
      if (type) validateOrder.push(Validator.checkType(type));
      await Promise.all(validateOrder);
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async checkAllRequired(data) {
    try {
      if (!Object.keys(data).length) throw new Error('input is empty');
      const {
        type,
      } = data;
      const validateOrder = [];
      validateOrder.push(Validator.checkType(type));
      await Promise.all(validateOrder);
    } catch (err) {
      throw Error(err.message);
    }
  }
}

module.exports = Validator;
