module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      nickname: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING(process.env.USER_NICKNAME_LENGTH),
      },
      email: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING(process.env.USER_EMAIL_LENGTH),
      },
      password: {
        type: Sequelize.STRING(process.env.USER_PASSWORD_LENGTH),
      },
      name: {
        type: Sequelize.STRING(process.env.USER_NAME_LENGTH),
      },
      age: {
        type: Sequelize.SMALLINT,
      },
      about: {
        type: Sequelize.TEXT,
      },
      hobbies: {
        type: Sequelize.TEXT,
      },
      photo: {
        type: Sequelize.STRING(100),
      },
      markTotal: {
        type: Sequelize.SMALLINT,
      },
      markDivider: {
        type: Sequelize.SMALLINT,
      },
      gender: {
        type: Sequelize.SMALLINT,
        references: {
          model: 'Genders',
          key: 'id',
        },
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
    await queryInterface.dropTable('Users');
  },
};
