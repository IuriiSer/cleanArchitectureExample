const bcrypt = require('bcrypt');
const Converter = require('../lib/converter');
const UserDriver = require('../drivers/UserDriver');
const standartData = require('../lib/standartData');
const StatusInterface = require('./StatusInterface');
const GenderInterface = require('./GenderInterface');

const { DEFAULT_CREATE_STATUS } = process.env;

class UserInterface {
  /**
   * @param {UUIDv4} user
   * @returns {{ ok: true||false, true ? data, false: message}}
   * return Object with data depends on ok key
   */
  static async get(user) {
    try {
      let getRes = await UserDriver.getUser(UserDriver.where.CACHE, user);
      if (!getRes) {
        const rawData = await UserDriver.getUser(UserDriver.where.PSQL, user);
        if (!rawData) return null;
        getRes = await UserDriver
          .setUser(UserDriver.where.CACHE, {
            uuid: user,
            data: Converter.User.driverGet(rawData),
          });
      }
      return getRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async getPassword({ user, nickname }) {
    try {
      if (!user && !nickname) throw new Error('no query');
      const getRes = await UserDriver.getUserPassword(UserDriver.where.PSQL, { user, nickname });
      return getRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  /**
   * @param {{name, age, ...UserInterface}} criterias
   * @returns { true || false}
   */
  static async isExist(criterias) {
    try {
      const getRes = await UserDriver.getUserByCriterias(
        UserDriver.where.PSQL,
        Converter.User.driverSet(criterias),
      );
      if (getRes) return true;
      return false;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async set(user, _data) {
    try {
      let setRes;

      const data = { ..._data };

      if (data.gender) { data.gender = await GenderInterface.getId(data.gender); }
      if (data.password) {
        data.password = await bcrypt.hash(`${data.password}${user}`, 1);
      }

      setRes = await UserDriver.setUser(
        UserDriver.where.PSQL,
        { uuid: user, data: Converter.User.driverSet(data) },
      );

      // if we don`t have user in DB
      // that`s mean our user is temporary
      if (!setRes) {
        const getRes = await UserDriver.getUser(UserDriver.where.CACHE, user);
        // get data with ipdates
        const dataToSet = { ...getRes, ...data };
        // if we have data minimum
        // write data to db
        // update cache
        if (standartData.isMinimumProfile(dataToSet)) {
          const status = await StatusInterface.getId(DEFAULT_CREATE_STATUS);
          if (!status) throw Error(`UserInterface setting wrong status -> ${DEFAULT_CREATE_STATUS}`);
          setRes = await UserDriver.createUser(
            UserDriver.where.PSQL,
            { ...Converter.User.driverSet({ ...dataToSet, status, uuid: user }) },
          );
          setRes = await UserDriver.setUser(
            UserDriver.where.CACHE,
            { uuid: user, data: { ...Converter.User.driverGet(setRes), justRegistrated: true } },
          );
          return setRes;
        }
        // if we dont have data minimum
        // update only cache
        setRes = await UserDriver.setUser(
          UserDriver.where.CACHE,
          { uuid: user, data: dataToSet },
        );
        return setRes;
      }

      setRes = await UserDriver.setUser(
        UserDriver.where.CACHE,
        { uuid: user, data: Converter.User.driverGet(setRes) },
      );
      return setRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async create(user, data) {
    try {
      let setRes;

      if (data.isNotInDb) {
        setRes = await UserDriver.setUser(
          UserDriver.where.CACHE,
          { uuid: user, data },
        );
        return setRes;
      }

      setRes = await UserDriver.createUser(
        UserDriver.where.PSQL,
        Converter.User.driverSet(data),
      );
      setRes = await UserDriver.setUser(
        UserDriver.where.CACHE,
        { uuid: setRes.uuid, data: Converter.User.driverGet(setRes) },
      );
      return setRes;
    } catch (err) {
      throw Error(err.message);
    }
  }
}

module.exports = UserInterface;
