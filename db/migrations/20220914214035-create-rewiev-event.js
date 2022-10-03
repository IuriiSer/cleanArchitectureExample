module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RewievEvents', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      event: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Events',
          key: 'uuid',
        },
      },
      owner: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'uuid',
        },
      },
      descriprtion: {
        type: Sequelize.STRING(process.env.REVIEW_EVENT_DESCRIPTION_LENGTH),
      },
      mark: {
        allowNull: false,
        type: Sequelize.SMALLINT,
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
    await queryInterface.dropTable('RewievEvents');
  },
};
