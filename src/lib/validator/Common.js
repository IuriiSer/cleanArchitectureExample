class Validator {
  static checkNumber(number, entityName) {
    try {
      if (typeof number !== 'number') throw new Error(`${entityName} is not a number`);
      if (Number.isNaN(number)) throw new Error(`${entityName} is not a number`);
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static isEmpty(data, dataName) {
    try {
      if (!data) throw new Error(`${dataName} is empty`);
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  }
}

module.exports = Validator;
