class Converet {
  static driverGet(data) {
    return {
      name: data.name,
    };
  }

  static driverSet(_data) {
    const data = {};
    if (_data.name) data.name = _data.name;
    return data;
  }
}

module.exports = Converet;
