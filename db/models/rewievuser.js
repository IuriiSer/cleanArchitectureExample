const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RewievUser extends Model {
    static associate({ User, Event }) {
      this.belongsTo(User, { foreignKey: 'owner', as: 'master' });
      this.belongsTo(User, { foreignKey: 'user', as: 'slaver' });
      this.belongsTo(Event, { foreignKey: 'event' });
    }
  }
  RewievUser.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    event: DataTypes.UUID,
    owner: DataTypes.UUID,
    user: DataTypes.UUID,
    mark: DataTypes.SMALLINT,
  }, {
    sequelize,
    modelName: 'RewievUser',
  });
  return RewievUser;
};
