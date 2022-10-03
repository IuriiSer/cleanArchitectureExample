const { EventType } = require('../../db/models');

const Redis = require('../lib/redis');

const { CACHE_STATIC_DATA_ALIVE } = process.env;

class EventTypeDriver {
  where = {
    PSQL: 'PSQL',
    CACHE: 'CACHE',
  };

  res;

  async getEventType(where, id) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getEventTypePsql(id);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#getEventTypeRedis(id);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getEventType');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async getEventTypeId(where, name) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getEventTypeIdPsql(name);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getEventType');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async setEventType(where, { id, data }) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#setEventTypePsql(id, data);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#setEventTypeRedis(id, data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> setEventType');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async createEventType(where, data) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#createEventTypePsql(data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> createEventType');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async #getEventTypePsql(id) {
    try {
      const query = {
        raw: true,
      };
      this.res = await EventType.findByPk(id, { ...query });
    } catch (err) {
      throw new Error(`err while getEventTypePsql -> ${err.message}`);
    }
  }

  async #getEventTypeIdPsql(name) {
    try {
      const query = {
        where: { name },
        raw: true,
      };
      this.res = await EventType.findOne({ ...query });
    } catch (err) {
      throw new Error(`err while getEventTypeIdPsql -> ${err.message}`);
    }
  }

  async #setEventTypePsql(id, data) {
    try {
      const res = await EventType.findByPk(id);
      if (!res) throw new Error('no eventType');
      if (data.id) delete data.id;
      await res.update({ ...data });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while setEventTypePsql -> ${err.message}`);
    }
  }

  async #createEventTypePsql(data) {
    try {
      const res = await EventType.create({ ...data });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while createEventTypePsql -> ${err.message}`);
    }
  }

  async #getEventTypeRedis(id) {
    try {
      this.res = await Redis.getCache(`eventType?id=${id}`);
    } catch (err) {
      throw new Error(`err while getEventTypeRedis -> ${err.message}`);
    }
  }

  async #setEventTypeRedis(id, data) {
    try {
      this.res = await Redis.setCache(`eventType?id=${id}`, CACHE_STATIC_DATA_ALIVE, () => ({ ...data }));
    } catch (err) {
      throw new Error(`err while setEventTypeRedis -> ${err.message}`);
    }
  }
}

module.exports = new EventTypeDriver();
