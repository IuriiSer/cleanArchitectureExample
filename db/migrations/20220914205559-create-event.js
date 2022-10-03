module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      type: {
        allowNull: false,
        type: Sequelize.SMALLINT,
        references: {
          model: 'EventTypes',
          key: 'id',
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
      info: {
        type: Sequelize.JSON,
      },
      title: {
        type: Sequelize.STRING(process.env.EVENT_TITLE_LENGTH),
      },
      descriprtion: {
        type: Sequelize.STRING(process.env.EVENT_DESCRIPTION_LENGTH),
      },
      timeBeg: {
        type: Sequelize.DATE,
      },
      timeEnd: {
        type: Sequelize.DATE,
      },
      markTotal: {
        type: Sequelize.INTEGER,
      },
      markDivider: {
        type: Sequelize.INTEGER,
      },
      coordinates: {
        type: Sequelize.STRING(process.env.EVENT_COORDINATES_LENGTH),
      },
      chat: {
        unique: true,
        allowNull: false,
        type: Sequelize.UUID,
      },
      status: {
        allowNull: false,
        type: Sequelize.SMALLINT,
        references: {
          model: 'Statuses',
          key: 'id',
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
    await queryInterface.dropTable('Events');
  },
};
