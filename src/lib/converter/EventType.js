class Converter {
  static driverGet(data) {
    return {
      id: data.id,
      fields: data.fields,
      name: data.name,
    };
  }

  static driverSet(_data) {
    const data = {};
    if (_data.name) data.name = _data.name;
    if (_data.fields) data.fields = _data.fields;
    if (_data.name) data.name = _data.name;
    return data;
  }
}

module.exports = Converter;
