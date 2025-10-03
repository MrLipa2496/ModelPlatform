'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      USR_ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      USR_Email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      USR_PasswordHash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      USR_Role: {
        type: Sequelize.ENUM('model', 'agency', 'admin'),
        allowNull: false,
        defaultValue: 'model'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Users_USR_Role";'
    )
  }
}
