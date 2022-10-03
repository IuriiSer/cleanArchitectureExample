const { v4: uuidv4 } = require('uuid');
const createHttpError = require('http-errors');
const Responce = require('../api/Responce');

const Services = require('.');
const Interfaces = require('../interfaces');

const Converter = require('../lib/converter');
const Validator = require('../lib/validator');
const standartData = require('../lib/standartData');
const fillData = require('../lib/fillData');

class ProfileService {
  static async getProfileFull(req, res, next) {
    try {
      const { user } = res.locals;
      const profile = await Interfaces.User.get(user);
      const ownEventsList = await Interfaces.Event.getAllOwn(user);
      const allEventsList = await Interfaces.Event.getAllByUser(user);
      profile.ownEvents = await Promise
        .all(ownEventsList.map((event) => Services.Event.getShort(event)));
      profile.allEvents = await Promise
        .all(allEventsList.map((event) => Services.Event.getShort(event)));
      await Promise.all([
        fillData({ data: profile, key: 'gender' }, { callback: Interfaces.Gender.get, dataKeys: ['name'] }),
        fillData({ data: profile, key: 'status' }, { callback: Interfaces.Status.get, dataKeys: ['name'] }),
      ]);
      Responce.json(
        { req, res, next },
        Converter.Profile.apiFull(profile),
      );
    } catch (err) {
      next(createHttpError(500, err));
    }
  }

  static async getProfileShortApi(req, res, next) {
    try {
      const { user } = res.locals;
      const profileData = await ProfileService.getProfileShort(user);
      Responce.json({ req, res, next }, profileData);
    } catch (err) {
      next(createHttpError(500, err));
    }
  }

  static async getProfileShort(user) {
    try {
      const profileData = await Interfaces.User.get(user);
      await Promise.all([
        fillData({ data: profileData, key: 'gender' }, { callback: Interfaces.Gender.get, dataKeys: ['name'] }),
        fillData({ data: profileData, key: 'status' }, { callback: Interfaces.Status.get, dataKeys: ['name'] }),
      ]);

      return Converter.Profile.apiShort(profileData);
    } catch (err) {
      throw Error(err.message);
    }
  }

  static async createProfile(req, res, next) {
    try {
      const user = uuidv4();
      const { accToken, refToken } = await Services.Jwt.create({ user });
      const profile = new standartData.NewProfile();
      await Interfaces.User.create(user, profile);
      Responce.session(
        { req, res, next },
        { toCookies: { refToken }, toSent: { token: accToken } },
      );
    } catch (err) {
      next(createHttpError(500, err));
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const data = Converter.Profile.apiGet(req.body);
      await Validator.Profile.checkAllPossible(data);
      const { user } = res.locals;
      const profile = await Interfaces.User.set(user, data);
      Responce.json({ req, res, next }, Converter.Profile.apiFull(profile));
    } catch (err) {
      next(createHttpError(400, err));
    }
  }

  /**
   * Set account status to unActive
   */
  static async setProfileUnActive(req, res, next) {
    try {
      const { user } = res.locals;
      const unActive = await Interfaces.Status.getId('profile_unActive');
      if (!unActive) throw Error('wrong profile status');
      Interfaces.User.set(user, { status: unActive });
      Responce.ok({ req, res, next });
    } catch (err) {
      next(createHttpError(500, err));
    }
  }
}

module.exports = ProfileService;
