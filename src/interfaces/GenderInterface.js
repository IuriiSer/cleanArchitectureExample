const Converter = require('../lib/converter');

const GenderDriver = require('../drivers/GenderDriver');

class GenderInterface {
  /**
   * @param {Number(id)} genderId
   * @returns { data }
   * return Value of id
   */
  static async get(genderId) {
    try {
      let getRes = await GenderDriver.getGender(GenderDriver.where.CACHE, genderId);
      if (!getRes) {
        const rawData = await GenderDriver.getGender(GenderDriver.where.PSQL, genderId);
        getRes = await GenderDriver
          .setGender(GenderDriver.where.CACHE, {
            id: genderId,
            data: Converter.Gender.genderDriverGet(rawData),
          });
      }
      return getRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  /**
   * @param {String(genderName)} genderName
   * @returns { Number(id) } retruns Gender id
   */
  static async getId(genderName) {
    try {
      const rawData = await GenderDriver.getGenderId(GenderDriver.where.PSQL, genderName);
      return rawData.id;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async set(id, data) {
    try {
      let setRes = await GenderDriver.setGender(
        GenderDriver.where.PSQL,
        { uuid: id, data: Converter.Gender.genderDriverSet(data) },
      );
      setRes = await GenderDriver.setGender(
        GenderDriver.where.CACHE,
        { uuid: id, data: Converter.Gender.genderDriverGet(setRes) },
      );
      return setRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async create(data) {
    try {
      let setRes = await GenderDriver.createGender(
        GenderDriver.where.PSQL,
        Converter.Gender.genderDriverSet(data),
      );
      setRes = await GenderDriver.setGender(
        GenderDriver.where.CACHE,
        { uuid: setRes.uuid, data: Converter.Gender.genderDriverGet(setRes) },
      );
      return setRes;
    } catch (err) {
      throw Error(err.message);
    }
  }
}

module.exports = GenderInterface;
