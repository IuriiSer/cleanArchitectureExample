const { UserChat } = require('../../db/models');

const Redis = require('../lib/redis');

const { CACHE_STATIC_DATA_ALIVE } = process.env;

class UserChatDriver {
  where = {
    PSQL: 'PSQL',
    CACHE: 'CACHE',
  };

  res;

  // * get users by chat
  async getUsers(where, chat) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getUsersPsql(chat);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#getUsersRedis(chat);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> UserChatDriver / getUsers');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  /**
   * get Chats by User uuid
   * @param {*} user
   * @returns {[chats] || null}
   */
  async getChats(where, user) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#getChatsPsql(user);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> UserChatDriver / getChats');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  /**
   *
   * @param {PSQL or CACHE} where place to save data
   * @param {{user / [users], chat}} data in uuidv4 format
   * @returns updated info
   */
  async subscribe(where, data) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#subscribePsql(data);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#subscribeRedis(data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> UserChatDriver / subscribe');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  async unSubscribe(where, data) {
    try {
      switch (where) {
        case this.where.PSQL: {
          await this.#unSubscribePsql(data);
          return this.res;
        }
        case this.where.CACHE: {
          await this.#subscribeRedis(data);
          return this.res;
        }
        default:
          throw new Error('wrong driver place -> UserChatDriver / unSubscribe');
      }
    } catch (err) {
      throw Error(err.message);
    }
  }

  /**
   * get all user`s chats by his uuidv4
   * @param {UUIDv4} user UUIDv4
   */
  async #getChatsPsql(user) {
    try {
      const query = {
        where: { user },
        raw: true,
      };
      const res = await UserChat.findAll({ ...query });
      this.res = res || [];
    } catch (err) {
      throw new Error(`err while getChatsPsql -> ${err.message}`);
    }
  }

  /**
   * get all users in chat by chat uuidv4
   * @param {UUIDv4} chat
   */
  async #getUsersPsql(chat) {
    try {
      const query = {
        where: { chat },
        raw: true,
      };
      this.res = await UserChat.findOne({ ...query });
    } catch (err) {
      throw new Error(`err while getUsersPsql -> ${err.message}`);
    }
  }

  /**
   * get users [UUIDv4] by chat UUIDv4
   * @param {UUIDv4} chat
   */
  async #getUsersRedis(chat) {
    try {
      this.res = await Redis.getCache(`userChat?chat=${chat}`);
    } catch (err) {
      throw new Error(`err while getUsersRedis -> ${err.message}`);
    }
  }

  /**
   * create new entity in DB UserChat / Model
   * @param {{ user, chat }}
   */
  async #subscribePsql({ user, chat }) {
    try {
      const res = await UserChat.create({ user, chat });
      this.res = res.dataValues;
    } catch (err) {
      throw new Error(`err while subscribePsql -> ${err.message}`);
    }
  }

  /**
   * write new record
   * @param {{ chat, [users] }}
   */
  async #subscribeRedis({ chat, users }) {
    try {
      this.res = await Redis.setCache(`userChat?chat=${chat}`, CACHE_STATIC_DATA_ALIVE, () => users);
    } catch (err) {
      throw new Error(`err while subscribePsql -> ${err.message}`);
    }
  }

  /**
   * rm entity from DB UserChat / Model by attribute key
   * @param {{ user, chat }}
   */
  async #unSubscribePsql({ user, chat }) {
    try {
      const query = {
        where: { user, chat },
      };
      this.res = await UserChat.destroy({ ...query });
    } catch (err) {
      throw new Error(`err while unSubscribePsql -> ${err.message}`);
    }
  }
}

module.exports = new UserChatDriver();
