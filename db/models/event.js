const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate({
      EventType, User, RewievEvent, EventUser, Status, RewievUser,
    }) {
      this.belongsTo(User, { foreignKey: 'owner' });
      this.belongsToMany(User, { through: EventUser, foreignKey: 'event', as: 'allUser' });
      this.belongsTo(EventType, { foreignKey: 'type' });
      this.hasMany(RewievEvent, { foreignKey: 'event' });
      this.hasMany(RewievUser, { foreignKey: 'event' });
      this.belongsTo(Status, { foreignKey: 'status' });
    }
  }
  Event.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    type: DataTypes.SMALLINT,
    owner: DataTypes.UUID,
    info: DataTypes.JSON,
    title: DataTypes.STRING(process.env.EVENT_TITLE_LENGTH),
    descriprtion: DataTypes.STRING(process.env.EVENT_DESCRIPTION_LENGTH),
    timeBeg: DataTypes.DATE,
    timeEnd: DataTypes.DATE,
    markTotal: DataTypes.INTEGER,
    markDivider: DataTypes.INTEGER,
    coordinates: DataTypes.STRING(process.env.EVENT_COORDINATES_LENGTH),
    chat: DataTypes.UUID,
    status: DataTypes.SMALLINT,
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
