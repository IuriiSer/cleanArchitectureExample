module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('EventTypes', [{
    name: 'cinema',
    fields: JSON.stringify({ cinema: '', seansUuid: '' }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }, {
    name: 'restoraunt',
    fields: JSON.stringify({ kitchen: '' }),
    createdAt: new Date(),
    updatedAt: new Date(),

  }]),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('EventTypes', null, {}),
};
