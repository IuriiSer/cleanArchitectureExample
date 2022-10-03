const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RewievEvent extends Model {
    static associate({ User, Event }) {
      this.belongsTo(User, { foreignKey: { name: 'owner' } });
      this.belongsTo(Event, { foreignKey: 'event' });
    }
  }
  RewievEvent.init({
    event: DataTypes.UUID,
    owner: DataTypes.UUID,
    descriprtion: DataTypes.STRING(process.env.REVIEW_EVENT_DESCRIPTION_LENGTH),
    mark: DataTypes.SMALLINT,
  }, {
    sequelize,
    modelName: 'RewievEvent',
  });
  return RewievEvent;
};
