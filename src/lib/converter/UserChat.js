class Converter {
  static driverGetUsers(data) {
    return {
      user: data.user,
    };
  }

  static driverGetChats(data) {
    return {
      chat: data.chat,
    };
  }

  static driverSet(_data) {
    const data = {};
    if (_data.user) data.user = _data.user;
    if (_data.chat) data.chat = _data.chat;
    return data;
  }
}

module.exports = Converter;
