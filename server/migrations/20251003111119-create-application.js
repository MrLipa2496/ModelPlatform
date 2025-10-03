'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Applications', {
      APP_ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CST_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Castings',
          key: 'CST_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      MOD_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Models',
          key: 'MOD_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      APP_Status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
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
    await queryInterface.dropTable('Applications')
  }
}
