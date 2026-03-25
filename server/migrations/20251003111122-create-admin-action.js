'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('AdminActions', {
      ACT_ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      USR_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'USR_ID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ACT_Type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ACT_TargetType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ACT_TargetID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ACT_Details: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('AdminActions');
  },
};
