'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Agencies', {
      AGN_ID: {
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
      AGN_Name: { type: Sequelize.STRING, allowNull: false },
      AGN_Logo: { type: Sequelize.STRING },
      AGN_Description: { type: Sequelize.TEXT },
      AGN_Phone: { type: Sequelize.STRING },
      AGN_Website: { type: Sequelize.STRING },
      AGN_Country: { type: Sequelize.STRING },
      AGN_City: { type: Sequelize.STRING },
      AGN_Verified: { type: Sequelize.BOOLEAN, defaultValue: false },
      AGN_Status: {
        type: Sequelize.ENUM('active', 'blocked', 'pending'),
        defaultValue: 'pending',
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
    await queryInterface.dropTable('Agencies');
  },
};
