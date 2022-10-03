module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserMessages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'uuid',
        },
      },
      chat: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING(process.env.MESSAGE_CONTENT_LENGTH),
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
    await queryInterface.dropTable('UserMessages');
  },
};
