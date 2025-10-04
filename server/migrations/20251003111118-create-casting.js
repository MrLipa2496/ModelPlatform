'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Castings', {
      CST_ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AGN_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Agencies',
          key: 'AGN_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      CST_Title: { type: Sequelize.STRING, allowNull: false },
      CST_Description: { type: Sequelize.TEXT },
      CST_Requirements: { type: Sequelize.TEXT },
      CST_Payment: { type: Sequelize.DECIMAL },
      CST_Status: {
        type: Sequelize.ENUM(
          'pending',
          'approved',
          'rejected',
          'active',
          'closed'
        ),
        defaultValue: 'pending'
      },
      CST_StartDate: { type: Sequelize.DATE },
      CST_EndDate: { type: Sequelize.DATE },
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
    await queryInterface.dropTable('Castings')
  }
}
