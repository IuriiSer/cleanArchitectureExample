const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventType extends Model {
    static associate({ Event }) {
      this.hasMany(Event, { foreignKey: 'type' });
    }
  }
  EventType.init({
    name: DataTypes.STRING(process.env.EVENT_TYPE_NAME_LENGTH_MAX),
    fields: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'EventType',
  });
  return EventType;
};
