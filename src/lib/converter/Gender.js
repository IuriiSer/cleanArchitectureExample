class Converter {
  static genderDriverGet(data) {
    return {
      id: data.id,
      name: data.name,
    };
  }

  static genderDriverSet(_data) {
    const data = {};
    if (_data.name) data.name = _data.name;
    return data;
  }
}

module.exports = Converter;
