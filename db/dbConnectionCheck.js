const { sequelize } = require('./models');

module.exports = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    throw new Error('Problem throw Authenticate DB', error);
  }
};
