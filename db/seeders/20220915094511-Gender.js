module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Genders', [{
    name: 'man',
    createdAt: new Date(),
    updatedAt: new Date(),
  }, {
    name: 'woman',
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Genders', null, {}),
};
