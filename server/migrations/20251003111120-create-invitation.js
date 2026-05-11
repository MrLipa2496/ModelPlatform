'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Invitations', {
      INV_ID: {
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
      INV_Status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
      },
      INV_SentAt: {
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
    await queryInterface.dropTable('Invitations')
  }
}
