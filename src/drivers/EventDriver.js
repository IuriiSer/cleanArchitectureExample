const { Event, EventUser, User } = require('../../db/models');

const Redis = require('../lib/redis');

const { CACHE_STATIC_DATA_ALIVE } = process.env;

class EventDriver {
  where = {
    PSQL: 'PSQL',
    CACHE: 'CACHE',
  };

  res;

  async getData(where, uuid) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getPsql(uuid);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#getRedis(uuid);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> get');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  // todo add methods to getSubscribers of event in cache
  async getSubscribers(where, event) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getSubscribersPsql(event);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> subscribe');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  // todo add methods to subscribe to events in cache
  async subscribe(where, data) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#subscribePsql(data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> subscribe');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  // todo add methods to unsubscribe to events in cache
  async unSubscribe(where, data) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#unSubscribePsql(data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> unSubscribe');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  // todo add methods to keep all user events in cache
  async getAll(where, uuid) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getAllPsql(uuid);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getAllEvent');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async getFiltred(where, query) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getFiltredPsql(query);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getFiltredEvent');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  // todo add methods to keep own user events in cache
  async getAllOwn(where, uuid) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getAllOwnPsql(uuid);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getAllOwnEvent');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async update(where, { uuid, data }) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#setPsql(uuid, data);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#setRedis(uuid, data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> setEvent');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async create(where, data) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#createPsql(data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> createEvent');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async #getPsql(uuid) {
    try {
      const query = {
        where: { uuid },
        raw: true,
      };
      this.res = await Event.findOne({ ...query });
    } catch (err) {
      throw new Error(`err while getEventPsql -> ${err.message}`);
    }
  }

  async #getSubscribersPsql(event) {
    try {
      const query = {
        where: { event },
        raw: true,
      };
      const res = await EventUser.findAll({ ...query });
      this.res = res || [];
    } catch (err) {
      throw new Error(`err while getSubscribersPsql -> ${err.message}`);
    }
  }

  // user events by user uuid
  async #getAllPsql(uuid) {
    try {
      const query = {
        where: { user: uuid },
        raw: true,
      };
      const res = await EventUser.findAll({ ...query });
      this.res = res || [];
    } catch (err) {
      throw new Error(`err while getAllEventPsql -> ${err.message}`);
    }
  }

  async #getAllAllPsql() {
    try {
      this.res = await Event.findAll({ include: { model: User } });
    } catch (err) {
      throw new Error(`err while getEventPsql -> ${err.message}`);
    }
  }

  async #getFiltredPsql(query) {
    try {
      const res = await Event.findAll(query);
      this.res = res || [];
    } catch (err) {
      throw new Error(`err while getFiltredPsql -> ${err.message}`);
    }
  }

  async #getAllOwnPsql(uuid) {
    try {
      const query = {
        where: { owner: uuid },
        attributes: ['uuid'],
        raw: true,
      };
      const res = await Event.findAll({ ...query });
      this.res = res || [];
    } catch (err) {
      throw new Error(`err while getAllOwnEventPsql -> ${err.message}`);
    }
  }

  async #setPsql(uuid, data) {
    try {
      const query = {
        where: { uuid },
      };
      const res = await Event.findOne({ ...query });
      if (!res) throw new Error('no event');
      if (data.uuid) delete data.uuid;
      await res.update({ ...data });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while setEventPsql -> ${err.message}`);
    }
  }

  async #createPsql(data) {
    try {
      const res = await Event.create({ ...data });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while createEventPsql -> ${err.message}`);
    }
  }

  async #getRedis(uuid) {
    try {
      this.res = await Redis.getCache(`event?uuid=${uuid}`);
    } catch (err) {
      throw new Error(`err while getEventRedis -> ${err.message}`);
    }
  }

  async #setRedis(id, data) {
    try {
      this.res = await Redis.setCache(`event?uuid=${id}`, CACHE_STATIC_DATA_ALIVE, () => ({ ...data }));
    } catch (err) {
      throw new Error(`err while setEventRedis -> ${err.message}`);
    }
  }

  async #subscribePsql({ user, event }) {
    try {
      const res = await EventUser.create({ user, event });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while subscribePsql -> ${err.message}`);
    }
  }

  async #unSubscribePsql({ user, event }) {
    try {
      const query = {
        where: { user, event },
      };
      this.res = await Event.destroy({ ...query });
    } catch (err) {
      throw new Error(`err while getEventPsql -> ${err.message}`);
    }
  }
}

module.exports = new EventDriver();
