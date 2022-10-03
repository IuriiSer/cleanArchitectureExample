const { Op } = require('sequelize');
const { User } = require('../../db/models');

const Redis = require('../lib/redis');

const { CACHE_USER_DATA_ALIVE } = process.env;

class UserDriver {
  where = {
    PSQL: 'PSQL',
    CACHE: 'CACHE',
  };

  res;

  async getUser(where, uuid) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getUserPsql(uuid);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#getUserRedis(uuid);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getUser');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async getUserPassword(where, data) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getUserPsqlPassword(data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getUserPassword');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  /**
   * Get User by criterias
   * @param { where } DB type where to search
   * @param { criterias: { uuid, nickname, email } } criterias is Object with search keys
   */
  async getUserByCriterias(where, criterias) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getUserPsqlByCriterias(criterias);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getUserByCriterias');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async setUser(where, { uuid, data }) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#setUserPsql(uuid, data);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#setUserRedis(uuid, data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> setUser');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async createUser(where, data) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#createUserPsql(data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> createUser');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async #getUserPsql(uuid) {
    try {
      const query = {
        where: { uuid },
        raw: true,
        attributes: { exclude: ['password'] },
      };
      this.res = await User.findOne({ ...query });
    } catch (err) {
      throw new Error(`err while getUserPsql -> ${err}`);
    }
  }

  async #getUserPsqlPassword(data) {
    try {
      const { user, nickname } = data;
      const query = {
        where: {},
        raw: true,
        attributes: ['password', 'uuid'],
      };
      if (user) query.where = { uuid: user };
      if (nickname) query.where = { nickname };
      this.res = await User.findOne({ ...query });
    } catch (err) {
      throw new Error(`err while getUserPsqlPassword -> ${err}`);
    }
  }

  async #getUserPsqlByCriterias(_criterias) {
    try {
      const criterias = [];
      Object.keys(_criterias)
        .forEach((query) => criterias.push({ [query]: _criterias[query] }));
      const query = {
        where: { ...criterias[0] },
        raw: true,
        attributes: { exclude: ['password'] },
      };
      if (criterias.length > 1) query.where = { [Op.or]: criterias };
      this.res = await User.findOne({ ...query });
    } catch (err) {
      throw new Error(`err while getUserPsqlByCriterias -> ${err}`);
    }
  }

  async #setUserPsql(uuid, data) {
    try {
      const res = await User.findOne({ where: { uuid } });
      if (!res) { this.res = null; return; }
      await res.update({ ...data });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while setUserPsql -> ${err}`);
    }
  }

  async #createUserPsql(data) {
    try {
      const res = await User.create({ ...data });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while createUserPsql -> ${err}`);
    }
  }

  async #getUserRedis(uuid) {
    try {
      this.res = await Redis.getCache(`user?uuid=${uuid}`);
    } catch (err) {
      throw new Error(`err while getUserRedis -> ${err}`);
    }
  }

  async #setUserRedis(uuid, data) {
    try {
      this.res = await Redis.setCache(`user?uuid=${uuid}`, CACHE_USER_DATA_ALIVE, () => data);
    } catch (err) {
      throw new Error(`err while setUserRedis -> ${err}`);
    }
  }
}

module.exports = new UserDriver();
