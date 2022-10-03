module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Statuses', [{
    name: 'profile_new',
    createdAt: new Date(),
    updatedAt: new Date(),
  }, {
    name: 'profile_checking',
    createdAt: new Date(),
    updatedAt: new Date(),

  }, {
    name: 'profile_active',
    createdAt: new Date(),
    updatedAt: new Date(),

  }, {
    name: 'profile_unActive',
    createdAt: new Date(),
    updatedAt: new Date(),

  }, {
    // have permissions create events without checking
    name: 'profile_approved',
    createdAt: new Date(),
    updatedAt: new Date(),

  }, {
    name: 'event_new',
    createdAt: new Date(),
    updatedAt: new Date(),

  }, {
    name: 'event_checking',
    createdAt: new Date(),
    updatedAt: new Date(),

  }, {
    name: 'event_need_edit',
    createdAt: new Date(),
    updatedAt: new Date(),

  }, {
    name: 'event_active',
    createdAt: new Date(),
    updatedAt: new Date(),

  }, {
    name: 'event_unActive',
    createdAt: new Date(),
    updatedAt: new Date(),

  }]),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Statuses', null, {}),
};
