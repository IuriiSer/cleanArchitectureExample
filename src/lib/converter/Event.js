class Converter {
  static driverGet(data) {
    return {
      event: data.uuid,
      type: data.type,
      owner: data.owner,
      info: data.info,
      title: data.title,
      descriprtion: data.descriprtion,
      timeBeg: data.timeBeg,
      timeEnd: data.timeEnd,
      markTotal: data.markTotal,
      markDivider: data.markDivider,
      coordinates: data.coordinates,
      chat: data.chat,
      status: data.status,
    };
  }

  static driverSet(_data) {
    const data = {};
    if (_data.event) data.uuid = _data.event;
    if (_data.type) data.type = _data.type;
    if (_data.owner) data.owner = _data.owner;
    if (_data.info) data.info = _data.info;
    if (_data.title) data.title = _data.title;
    if (_data.descriprtion) data.descriprtion = _data.descriprtion;
    if (_data.timeBeg) data.timeBeg = new Date(_data.timeBeg);
    if (_data.timeEnd) data.timeEnd = new Date(_data.timeEnd);
    if (_data.markTotal) data.markTotal = _data.markTotal;
    if (_data.markDivider) data.markDivider = _data.markDivider;
    if (_data.coordinates) data.coordinates = _data.coordinates;
    if (_data.chat) data.chat = _data.chat;
    if (_data.status) data.status = _data.status;
    return data;
  }

  static driverSubcribe(data) {
    return {
      user: data.user,
      event: data.event,
    };
  }

  static apiSentFull(_data) {
    const data = {};
    if (_data.uuid) data.uuid = _data.uuid;
    if (_data.type) data.type = _data.type;
    if (_data.owner) data.owner = _data.owner;
    if (_data.info) data.info = _data.info;
    if (_data.title) data.title = _data.title;
    if (_data.descriprtion) data.descriprtion = _data.descriprtion;
    if (_data.timeBeg) data.timeBeg = _data.timeBeg;
    if (_data.timeEnd) data.timeEnd = _data.timeEnd;
    if (_data.markTotal) data.markTotal = _data.markTotal;
    if (_data.markDivider) data.markDivider = _data.markDivider;
    if (_data.coordinates) data.coordinates = _data.coordinates;
    if (_data.chat) data.chat = _data.chat;
    if (_data.status) data.status = _data.status;
    if (_data.subscribers) data.subscribers = _data.subscribers;
    return data;
  }

  static apiGetFull(_data) {
    const data = {};
    if (_data.uuid) data.event = _data.uuid;
    if (_data.info) data.info = _data.info;
    if (_data.type) data.type = _data.type;
    if (_data.title) data.title = _data.title;
    if (_data.descriprtion) data.descriprtion = _data.descriprtion;
    if (_data.timeBeg) data.timeBeg = Date.parse(_data.timeBeg);
    if (_data.timeEnd) data.timeEnd = Date.parse(_data.timeEnd);
    if (_data.coordinates) data.coordinates = _data.coordinates;
    return data;
  }

  static apiSentShort(_data) {
    const data = {};
    if (_data.title) data.title = _data.title;
    if (_data.coordinates) data.coordinates = _data.coordinates;
    if (_data.uuid) data.uuid = _data.uuid;
    if (_data.type) data.type = _data.type;
    if (_data.owner) data.owner = _data.owner;
    if (_data.title) data.title = _data.title;
    if (_data.timeBeg) data.timeBeg = _data.timeBeg;
    if (_data.timeEnd) data.timeEnd = _data.timeEnd;
    if (_data.markTotal) data.markTotal = _data.markTotal;
    if (_data.markDivider) data.markDivider = _data.markDivider;
    if (_data.status) data.status = _data.status;
    return data;
  }

  static filterForEvents(_data) {
    const data = {};
    if (_data.type) data.type = _data.type;
    if (_data.gender) data.gender = _data.gender;
    if (_data.length) data.length = Number(_data.length);
    if (_data.page) data.page = Number(_data.page);
    if (_data.descEnd === '') data.descEnd = true;
    if (_data.ascEnd === '') data.ascEnd = true;
    return data;
  }
}

module.exports = Converter;
