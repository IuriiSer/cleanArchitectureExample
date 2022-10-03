module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EventTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.SMALLINT,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(process.env.EVENT_TYPE_NAME_LENGTH_MAX),
      },
      fields: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EventTypes');
  },
};
