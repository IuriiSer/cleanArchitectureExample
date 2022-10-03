const Converter = require('../lib/converter');

const EventTypeDriver = require('../drivers/EventTypeDriver');

class EventTypeInterface {
  /**
   * @param {Number(id)} genderId
   * @returns { data }
   * return Value of id
   */
  static async get(id) {
    try {
      let getRes = await EventTypeDriver.getEventType(EventTypeDriver.where.CACHE, id);
      if (!getRes) {
        const rawData = await EventTypeDriver.getEventType(EventTypeDriver.where.PSQL, id);
        getRes = await EventTypeDriver
          .setEventType(EventTypeDriver.where.CACHE, {
            id,
            data: Converter.EventType.driverGet(rawData),
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
  static async getId(eventTypeName) {
    try {
      const rawData = await EventTypeDriver.getEventTypeId(
        EventTypeDriver.where.PSQL,
        eventTypeName,
      );
      return rawData.id;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async set(id, data) {
    try {
      let setRes = await EventTypeDriver.setEventType(
        EventTypeDriver.where.PSQL,
        { uuid: id, data: Converter.EventType.driverSet(data) },
      );
      setRes = await EventTypeDriver.setEventType(
        EventTypeDriver.where.CACHE,
        { uuid: id, data: Converter.EventType.driverSet(setRes) },
      );
      return setRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async create(data) {
    try {
      let setRes = await EventTypeDriver.createEventType(
        EventTypeDriver.where.PSQL,
        Converter.EventType.driverSet(data),
      );
      setRes = await EventTypeDriver.setEventType(
        EventTypeDriver.where.CACHE,
        { uuid: setRes.uuid, data: Converter.EventType.driverGet(setRes) },
      );
      return setRes;
    } catch (err) {
      throw Error(err.message);
    }
  }
}

module.exports = EventTypeInterface;
