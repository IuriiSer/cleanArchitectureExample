class Converter {
  static driverGet(data) {
    return {
      uuid: data.user,
      nickname: data.nickname,
      email: data.email,
      password: data.password,
      name: data.name,
      age: data.age,
      about: data.about,
      hobbies: data.hobbies,
      photo: data.photo,
      markTotal: data.markTotal,
      markDivider: data.markDivider,
      gender: data.gender,
      status: data.status,
      created: data.createdAt,
    };
  }

  static driverSet(_data) {
    const data = {};
    if (_data.uuid) data.uuid = _data.uuid;
    if (_data.nickname) data.nickname = _data.nickname;
    if (_data.email) data.email = _data.email;
    if (_data.password) data.password = _data.password;
    if (_data.name) data.name = _data.name;
    if (_data.age) data.age = _data.age;
    if (_data.about) data.about = _data.about;
    if (_data.hobbies) data.hobbies = _data.hobbies;
    if (_data.photo) data.photo = _data.photo;
    if (_data.markTotal) data.markTotal = _data.markTotal;
    if (_data.markDivider) data.markDivider = _data.markDivider;
    if (_data.gender) data.gender = _data.gender;
    if (_data.status) data.status = _data.status;
    return data;
  }
}

module.exports = Converter;
