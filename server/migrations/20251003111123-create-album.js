'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Albums', {
      ALB_ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ALB_ModelID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Models',
          key: 'MOD_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ALB_Title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ALB_Description: {
        type: Sequelize.TEXT
      },
      ALB_CreatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
    await queryInterface.dropTable('Albums')
  }
}
