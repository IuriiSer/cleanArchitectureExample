const Profile = require('./ProfileService');
const Jwt = require('./JwtService');
const Event = require('./EventService');
const Connections = require('./ConnectionsService');
const Authorization = require('./AuthorizationService');

module.exports = {
  Profile, Jwt, Event, Connections, Authorization,
};
