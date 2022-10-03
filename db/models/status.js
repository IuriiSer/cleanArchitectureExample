const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    static associate({ User, Event }) {
      this.hasMany(User, { foreignKey: 'status' });
      this.hasMany(Event, { foreignKey: 'status' });
    }
  }
  Status.init({
    name: DataTypes.STRING(process.env.STATUS_NAME_LENGTH),
  }, {
    sequelize,
    modelName: 'Status',
  });
  return Status;
};
