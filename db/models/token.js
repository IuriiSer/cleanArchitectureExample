const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'user' });
    }
  }
  Token.init({
    user: DataTypes.UUID,
    refToken: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};
