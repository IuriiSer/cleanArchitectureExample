const { Status } = require('../../db/models');

const Redis = require('../lib/redis');

const { CACHE_STATIC_DATA_ALIVE } = process.env;

class StatusDriver {
  where = {
    PSQL: 'PSQL',
    CACHE: 'CACHE',
  };

  res;

  async getStatus(where, id) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getStatusPsql(id);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#getStatusRedis(id);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getStatus');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async getStatusName(where, name) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getStatusNamePsql(name);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getStatusName');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async setStatus(where, { id, data }) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#setStatusPsql(id, data);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#setStatusRedis(id, data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> setStatus');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async createStatus(where, data) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#createStatusPsql(data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> createStatus');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async #getStatusPsql(id) {
    try {
      const res = await Status.findByPk(id);
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while getStatusPsql -> ${err}`);
    }
  }

  async #getStatusNamePsql(name) {
    try {
      const query = {
        where: { name },
        raw: true,
      };
      this.res = await Status.findOne({ ...query });
    } catch (err) {
      throw new Error(`err while getStatusNamePsql -> ${err}`);
    }
  }

  async #setStatusPsql(id, data) {
    try {
      const res = await Status.findByPk(id);
      if (!res) throw new Error('no status');
      if (data.id) delete data.id;
      await res.update({ ...data });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while setStatusPsql -> ${err}`);
    }
  }

  async #createStatusPsql(data) {
    try {
      const res = await Status.create({ ...data });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while createStatusPsql -> ${err}`);
    }
  }

  async #getStatusRedis(id) {
    try {
      this.res = await Redis.getCache(`status?id=${id}`);
    } catch (err) {
      throw new Error(`err while getStatusRedis -> ${err}`);
    }
  }

  async #setStatusRedis(id, data) {
    try {
      this.res = await Redis.setCache(`status?id=${id}`, CACHE_STATIC_DATA_ALIVE, () => ({ ...data }));
    } catch (err) {
      throw new Error(`err while setStatusRedis -> ${err}`);
    }
  }
}

module.exports = new StatusDriver();
