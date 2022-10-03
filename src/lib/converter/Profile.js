class Converter {
  static apiShort(data) {
    return {
      nickname: data.nickname,
      age: data.age,
      photo: data.photo,
      markTotal: data.markTotal,
      markDivider: data.markDivider,
      gender: data.gender,
      status: data.status,
      created: data.createdAt,
    };
  }

  static apiFull(data) {
    return {
      name: data.name,
      about: data.about,
      hobbies: data.hobbies,
      nickname: data.nickname,
      email: data.email,
      age: data.age,
      photo: data.photo,
      markTotal: data.markTotal,
      markDivider: data.markDivider,
      gender: data.gender,
      status: data.status,
      created: data.createdAt,
      ownEvents: data.ownEvents,
      allEvents: data.allEvents,
      about: data.about,
      hobbies: data.hobbies,
    };
  }

  static apiGet(_data) {
    const data = {};
    if (_data.nickname) data.nickname = _data.nickname;
    if (_data.email) data.email = _data.email;
    if (_data.password) data.password = _data.password;
    if (_data.name) data.name = _data.name;
    if (_data.age) data.age = _data.age;
    if (_data.about) data.about = _data.about;
    if (_data.hobbies) data.hobbies = _data.hobbies;
    if (_data.gender) data.gender = _data.gender;
    return data;
  }
}

module.exports = Converter;
