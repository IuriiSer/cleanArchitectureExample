class Converet {
  static rewievUserDriverGet(data) {
    return {
      uuid: data.uuid,
      event: data.event,
      owner: data.owner,
      user: data.user,
      mark: data.mark,
    };
  }

  static rewievUserDriverSet(_data) {
    const data = {};
    if (_data.uuid) data.uuid = _data.uuid;
    if (_data.event) data.event = _data.event;
    if (_data.owner) data.owner = _data.owner;
    if (_data.user) data.user = _data.user;
    if (_data.mark) data.mark = _data.mark;
    return data;
  }
}

module.exports = Converet;
