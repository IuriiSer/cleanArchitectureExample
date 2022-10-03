module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Admins', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      nickname: {
        allowNull: false,
        type: Sequelize.STRING(process.env.USER_NICKNAME_LENGTH_MAX),
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
    await queryInterface.dropTable('Admins');
  },
};
