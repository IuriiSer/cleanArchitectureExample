const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserMessage extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'user' });
    }
  }
  UserMessage.init({
    user: DataTypes.UUID,
    chat: DataTypes.UUID,
    content: DataTypes.STRING(process.env.MESSAGE_CONTENT_LENGTH),
  }, {
    sequelize,
    modelName: 'UserMessage',
  });
  return UserMessage;
};
