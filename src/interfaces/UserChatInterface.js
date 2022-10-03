const Converter = require('../lib/converter');
const UserChatDriver = require('../drivers/UserChatDriver');

class UserChatInterface {
  /**
   * get users from chat by uuidv4
   * @param {UUIDv4} chat
   * @returns {[UUIDv4]} usersUuid
   */
  static async getSubscribers(chat) {
    try {
      let getRes = await UserChatDriver.getUsers(UserChatDriver.where.CACHE, chat);
      if (!getRes) {
        const rawData = await UserChatDriver.getUsers(UserChatDriver.where.PSQL, chat);
        if (!rawData) throw Error('chat doesn`t exist');
        getRes = await UserChatDriver
          .setUser(UserChatDriver.where.CACHE, {
            uuid: chat,
            data: rawData.map((item) => Converter.UserChat.driverGetUsers(item)),
          });
      }
      return getRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  /**
   * get all user chats
   * @param {UUIDv4} user UUIDv4
   * @returns {[UUIDv4]} chats UUIDv4
   */
  static async getChats(user) {
    try {
      const rawData = await UserChatDriver.getChats(UserChatDriver.where.PSQL, user);
      const getRes = rawData.map((item) => Converter.UserChat.driverGetChats(item));
      return getRes;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async subscribe({ user, chat }) {
    try {
      const users = await UserChatInterface.getSubscribers(chat);
      // ! check do we have this USER in users
      if (users.includes(user)) throw new Error('user is already joined chat');
      await Promise.all([
        (async () => {
          await UserChatDriver.subscribe(
            UserChatDriver.where.CACHE,
            { users: users.concat(user), chat },
          );
        })(),
        (async () => {
          await UserChatDriver.subscribe(
            UserChatDriver.where.PSQL,
            { user, chat },
          );
        })(),
      ]);
    } catch (err) {
      throw Error(err.message);
    }
  }
}

module.exports = UserChatInterface;
