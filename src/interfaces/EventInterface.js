const Converter = require('../lib/converter');

const EventDriver = require('../drivers/EventDriver');

const { User } = require('../../db/models');

class EventInterface {
  /**
   * @param {Number(id)} genderId
   * @returns { data }
   * return Value of id
   */
  static async getData(event) {
    try {
      let getRes = await EventDriver.getData(EventDriver.where.CACHE, event);
      if (!getRes) {
        const rawData = await EventDriver.getData(EventDriver.where.PSQL, event);
        if (!rawData) throw Error('event doesn`t exist');
        getRes = await EventDriver
          .update(EventDriver.where.CACHE, {
            uuid: event,
            data: Converter.Event.driverGet(rawData),
          });
      }
      console.log(222222, getRes)
      return getRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async getAllByUser(user) {
    try {
      const rawData = await EventDriver.getAll(EventDriver.where.PSQL, user);
      const data = rawData.map((item) => item.event);
      return data;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async getAll({ length, offset }) {
    try {
      const rawData = await EventInterface.getFiltred({ length, offset, descEnd: true });
      return rawData;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async getFiltred(_query) {
    try {
      const {
        type, gender, length, offset, ascEnd, descEnd,
      } = _query;
      const query = { order: [], attributes: [['uuid', 'event'], 'timeEnd'], raw: true };
      const getRes = { data: [], meta: {} };
      // main query
      if (!descEnd && ascEnd) { query.order.push(['timeEnd', 'ASC']); getRes.meta.timeEnd = 'ASC'; }
      if (descEnd && !ascEnd) { query.order.push(['timeEnd', 'DESC']); getRes.meta.timeEnd = 'DESC'; }
      if (type) { query.where = { type }; getRes.meta.type = type; }
      if (gender) {
        query.include = {
          model: User,
          attributes: ['gender'],
          where: { gender },
        };
        getRes.meta.gender = gender;
      }
      // common query
      query.offset = offset; getRes.meta.offset = offset;
      query.limit = length; getRes.meta.length = length;

      getRes.data = await EventDriver.getFiltred(EventDriver.where.PSQL, query);
      getRes.meta.quantity = getRes.data.count || 0;

      return getRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async getAllOwn(user) {
    try {
      const rawData = await EventDriver.getAllOwn(EventDriver.where.PSQL, user);
      const data = rawData.map((event) => event.uuid);
      return data;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async update(event, data) {
    try {
      let setRes = await EventDriver.update(
        EventDriver.where.PSQL,
        { uuid: event, data: Converter.Event.driverSet(data) },
      );
      setRes = await EventDriver.update(
        EventDriver.where.CACHE,
        { uuid: event, data: Converter.Event.driverGet(setRes) },
      );
      return setRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async create(data) {
    try {
      let setRes = await EventDriver.create(
        EventDriver.where.PSQL,
        Converter.Event.driverSet(data),
      );
      setRes = await EventDriver.update(
        EventDriver.where.CACHE,
        { uuid: data.uuid, data: Converter.Event.driverGet(setRes) },
      );
      return setRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  // add converter to sub unsub methods
  static async subscribe({ user, event }) {
    try {
      const rawData = await EventDriver
        .subscribe(EventDriver.where.PSQL, Converter.Event.driverSubcribe({ user, event }));
      return Converter.Event.driverSubcribe(rawData);
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async unSubscribe({ user, event }) {
    try {
      try {
        const rawData = await EventDriver
          .unSubscribe(EventDriver.where.PSQL, Converter.Event.driverSubcribe({ user, event }));
        return Converter.Event.driverSubcribe(rawData);
      } catch (err) {
        throw Error(err.message);
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async getSubscribers(event) {
    try {
      const rawData = await EventDriver.getSubscribers(EventDriver.where.PSQL, event);
      const getRes = rawData.map((item) => item.user);
      return getRes;
    } catch (err) {
      throw Error(err.message);
    }
  }
}

module.exports = EventInterface;
