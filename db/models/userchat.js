const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserChat extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'user' });
    }
  }
  UserChat.init({
    user: DataTypes.UUID,
    chat: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'UserChat',
  });
  return UserChat;
};
