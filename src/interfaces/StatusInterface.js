const Converter = require('../lib/converter');

const StatusDriver = require('../drivers/StatusDriver');

class StatusInterface {
  static async get(id) {
    try {
      let getRes = await StatusDriver.getStatus(StatusDriver.where.CACHE, id);

      if (!getRes) {
        const rawData = await StatusDriver.getStatus(StatusDriver.where.PSQL, id);
        getRes = await StatusDriver
          .setStatus(StatusDriver.where.CACHE, {
            id,
            data: Converter.Status.driverGet(rawData),
          });
      }
      return getRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async getId(name) {
    try {
      const getRes = await StatusDriver.getStatusName(StatusDriver.where.PSQL, name);
      return getRes.id;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async set(id, data) {
    try {
      let setRes = await StatusDriver.setStatus(
        StatusDriver.where.PSQL,
        { uuid: id, data: Converter.Status.driverSet(data) },
      );
      setRes = await StatusDriver.setStatus(
        StatusDriver.where.CACHE,
        { uuid: id, data: Converter.Status.driverGet(setRes) },
      );
      return setRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async create(data) {
    try {
      let setRes = await StatusDriver.createStatus(
        StatusDriver.where.PSQL,
        Converter.Status.StatusDriverSet(data),
      );
      setRes = await StatusDriver.setStatus(
        StatusDriver.where.CACHE,
        { uuid: setRes.uuid, data: Converter.Status.driverGet(setRes) },
      );
      return setRes;
    } catch (err) {
      throw Error(err.message);
    }
  }
}

module.exports = StatusInterface;
