const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Gender extends Model {
    static associate({ User }) {
      this.hasMany(User, { foreignKey: 'gender' });
    }
  }
  Gender.init({
    name: DataTypes.STRING(24),
  }, {
    sequelize,
    modelName: 'Gender',
  });
  return Gender;
};
