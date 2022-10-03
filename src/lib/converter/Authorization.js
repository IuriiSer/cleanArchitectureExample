class Authorization {
  static apiGet(data) {
    return {
      nickname: data.nickname,
      password: data.password,
    };
  }
}

module.exports = Authorization;
