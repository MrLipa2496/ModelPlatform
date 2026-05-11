'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const password = 'AdminPass!1';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admins = [
      {
        USR_Role: 'admin',
        USR_Email: 'admin@example.com',
        USR_PasswordHash: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Users', admins);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Users',
      { USR_Email: 'admin@example.com' },
      {}
    );
  },
};
