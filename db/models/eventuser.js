const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventUser extends Model {
    static associate() {}
  }
  EventUser.init({
    event: DataTypes.UUID,
    user: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'EventUser',
  });
  return EventUser;
};
