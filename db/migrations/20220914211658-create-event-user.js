module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EventUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      event: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Events',
          key: 'uuid',
        },
      },
      user: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'uuid',
        },
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
    await queryInterface.dropTable('EventUsers');
  },
};
