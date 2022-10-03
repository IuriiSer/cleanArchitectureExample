const { Gender } = require('../../db/models');

const Redis = require('../lib/redis');

const { CACHE_STATIC_DATA_ALIVE } = process.env;

class GenderDriver {
  where = {
    PSQL: 'PSQL',
    CACHE: 'CACHE',
  };

  res;

  async getGender(where, id) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getGenderPsql(id);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#getGenderRedis(id);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getGender');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async getGenderId(where, name) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getGenderIdPsql(name);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> getGender');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async setGender(where, { id, data }) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#setGenderPsql(id, data);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#setGenderRedis(id, data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> setGender');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async createGender(where, data) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#createGenderPsql(data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> createGender');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async #getGenderPsql(id) {
    try {
      const query = {
        raw: true,
      };
      this.res = await Gender.findByPk(id, { ...query });
    } catch (err) {
      throw new Error(`err while getGenderPsql -> ${err.message}`);
    }
  }

  async #getGenderIdPsql(name) {
    try {
      const query = {
        where: { name },
        raw: true,
      };
      const res = await Gender.findOne({ ...query });
      if (!res) throw new Error('wrong gender');
      this.res = res;
    } catch (err) {
      throw new Error(`err while getGenderIdPsql -> ${err.message}`);
    }
  }

  async #setGenderPsql(id, data) {
    try {
      const res = await Gender.findByPk(id);
      if (!res) throw new Error('no gender');
      if (data.id) delete data.id;
      await res.update({ ...data });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while setGenderPsql -> ${err.message}`);
    }
  }

  async #createGenderPsql(data) {
    try {
      const res = await Gender.create({ ...data });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while createGenderPsql -> ${err.message}`);
    }
  }

  async #getGenderRedis(id) {
    try {
      this.res = await Redis.getCache(`gender?id=${id}`);
    } catch (err) {
      throw new Error(`err while getGenderRedis -> ${err.message}`);
    }
  }

  async #setGenderRedis(id, data) {
    try {
      this.res = await Redis.setCache(`gender?id=${id}`, CACHE_STATIC_DATA_ALIVE, () => ({ ...data }));
    } catch (err) {
      throw new Error(`err while setGenderRedis -> ${err.message}`);
    }
  }
}

module.exports = new GenderDriver();
