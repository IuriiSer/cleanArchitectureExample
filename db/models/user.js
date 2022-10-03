const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({
      Gender, Status, UserChat, UserMessage, Event, RewievEvent, RewievUser, EventUser, Token,
    }) {
      this.belongsTo(Gender, { foreignKey: 'gender' });
      this.belongsTo(Status, { foreignKey: 'status' });
      this.hasMany(UserChat, { foreignKey: 'user' });
      this.hasMany(UserMessage, { foreignKey: 'user' });
      this.hasMany(Event, { foreignKey: 'owner', as: 'eventOwner' });
      this.hasMany(RewievEvent, { foreignKey: 'owner' });
      this.hasMany(RewievUser, { foreignKey: 'owner', as: 'master' });
      this.hasMany(RewievUser, { foreignKey: 'user', as: 'slaver' });
      this.belongsToMany(Event, { through: EventUser, foreignKey: 'user', as: 'allEvents' });
      this.hasOne(Token, { foreignKey: 'user' });
    }
  }
  User.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    nickname: DataTypes.STRING(process.env.USER_NICKNAME_LENGTH),
    email: DataTypes.STRING(process.env.USER_EMAIL_LENGTH),
    password: DataTypes.STRING(process.env.USER_PASSWORD_LENGTH),
    name: DataTypes.STRING(process.env.USER_NAME_LENGTH),
    age: DataTypes.SMALLINT,
    about: DataTypes.TEXT,
    hobbies: DataTypes.TEXT,
    photo: DataTypes.STRING(100),
    markTotal: DataTypes.SMALLINT,
    markDivider: DataTypes.SMALLINT,
    gender: DataTypes.SMALLINT,
    status: DataTypes.SMALLINT,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
