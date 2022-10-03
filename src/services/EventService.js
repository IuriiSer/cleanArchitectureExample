const createHttpError = require('http-errors');
const { v4: uuidv4 } = require('uuid');
const Responce = require('../api/Responce');

const ProfileService = require('./ProfileService');
const Interfaces = require('../interfaces');

const Converter = require('../lib/converter');
const fillData = require('../lib/fillData');
const Validator = require('../lib/validator');

class EventService {
  static async getFullApi(req, res, next) {
    try {
      const event = req.params.uuid;
      const eventData = await EventService.getFull(event);
      Responce.json({ req, res, next }, Converter.Event.apiSentFull(eventData));
    } catch (err) {
      next(createHttpError(500, err));
    }
  }

  static async getFull(event) {
    try {
      const eventData = await Interfaces.Event.getData(event);
      await Promise.all([
        fillData({ data: eventData, key: 'owner' }, {
          callback: ProfileService.getProfileShort,
        }),
        fillData({ data: eventData, key: 'type' }, { callback: Interfaces.EventType.get, dataKeys: ['name'] }),
        fillData({ data: eventData, key: 'status' }, { callback: Interfaces.Status.get, dataKeys: ['name'] }),
      ]);
      const subscribersList = await Interfaces.Event.getSubscribers(event);
      eventData.subscribers = await Promise.all(
        subscribersList.map((user) => fillData({ data: { user }, key: 'user' }, { callback: Interfaces.User.get, dataKeys: ['uuid', 'nickname', 'photo'] })),
      );

      return eventData;
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async getShort(event) {
    try {
      const eventData = await Interfaces.Event.getData(event);
      await Promise.all([
        fillData({ data: eventData, key: 'owner' }, {
          callback: ProfileService.getProfileShort,
          dataKeys: ['uuid', 'nickname', 'age', 'markTotal', 'markDivider', 'photo'],
        }),
        fillData({ data: eventData, key: 'type' }, { callback: Interfaces.EventType.get, dataKeys: ['name'] }),
        fillData({ data: eventData, key: 'status' }, { callback: Interfaces.Status.get, dataKeys: ['name'] }),
      ]);
      return Converter.Event.apiSentShort(eventData);
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async getFiltered(req, res, next) {
    try {
      const filter = Converter.Event.filterForEvents(req.query);
      const { length, page } = filter;
      if (length) Validator.Common.checkNumber(length, 'length');
      if (page) Validator.Common.checkNumber(page, 'page');
      filter.length = length || 10;
      filter.offset = page * length || 0;
      if (!filter.descEnd && !filter.ascEnd) filter.descEnd = true;
      const getRes = await Interfaces.Event.getFiltred(filter);
      getRes.data = await Promise.all(
        getRes.data.map((item) => EventService.getShort(item.event)),
      );
      Responce.json({ req, res, next }, getRes);
    } catch (err) {
      next(createHttpError(400, err));
    }
  }

  static async create(req, res, next) {
    try {
      await Validator.Common.isEmpty(req.body.type, 'type');
      const { user } = res.locals;
      const event = uuidv4();
      const chat = uuidv4();
      const status = await Interfaces.Status.getId('event_new');
      const type = await Interfaces.EventType.getId(req.body.type);
      const data = Converter.Event.apiGetFull({
        ...req.body.data, uuid: event, owner: user, chat, status, type,
      });

      await Validator.Event.checkAllRequired(req.body);
      await Validator.Event.checkAllPossible(data);

      const eventData = await Interfaces.Event.create(data);
      await Interfaces.Event.subscribe({ user, event });

      Responce.json({ req, res, next }, Converter.Event.apiSentFull(
        { ...eventData, subscribers: [user] },
      ));
    } catch (err) {
      next(createHttpError(500, err));
    }
  }

  static async update(req, res, next) {
    try {
      const data = Converter.Event.apiGetFull(req.body);
      const { event } = data;
      if (data.type) data.type = await Interfaces.EventType.getId(data.type);
      await Validator.Event.checkAllPossible(data);
      const eventData = await Interfaces.Event.update(event, data);
      const subscribersList = await Interfaces.Event.getSubscribers(event);
      eventData.subscribers = await Promise.all(
        subscribersList.map((user) => fillData({ data: { user }, key: 'user' }, { callback: Interfaces.User.get, dataKeys: ['uuid', 'nickname', 'photo'] })),
      );
      Responce.json({ req, res, next }, Converter.Event.apiSentFull(eventData));
    } catch (err) {
      next(createHttpError(500, err));
    }
  }

  static async setUnActive(req, res, next) {
    try {
      const data = Converter.Event.apiGetFull(req.body);
      const { event } = data;
      const status = await Interfaces.Status.getId('event_unActive');
      await Interfaces.Event.update(event, { status });
      Responce.ok({ req, res, next });
    } catch (err) {
      next(createHttpError(500, err));
    }
  }

  // ! add user to eventchat
  static async subscribe(req, res, next) {
    try {
      const data = Converter.Event.apiGetFull(req.params);
      const { event } = data;
      const { user } = res.locals;
      await Interfaces.Event.subscribe({ event, user });
      const eventData = await EventService.getShort(event);
      Responce.json({ req, res, next }, eventData);
    } catch (err) {
      next(createHttpError(500, err));
    }
  }

  // ! remoive user to eventchat
  static async unSubscribe(req, res, next) {
    try {
      const data = Converter.Event.apiGetFull(req.params);
      const { event } = data;
      const { user } = res.locals;
      const subscriber = await Interfaces.Event.unSubscribe({ event, user });
      console.log(event);
      Responce.json({ req, res, next }, subscriber);
    } catch (err) {
      next(createHttpError(500, err));
    }
  }
}

module.exports = EventService;
