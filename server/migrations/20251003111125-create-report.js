'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reports', {
      RPT_ID: {
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
      RPT_ReportedUserID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'USR_ID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      RPT_Type: {
        type: Sequelize.ENUM('complaint', 'suggestion', 'technical', 'other'),
        allowNull: false,
        defaultValue: 'other',
      },
      RPT_Subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      RPT_Message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      RPT_Attachment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      RPT_Status: {
        type: Sequelize.ENUM('pending', 'in_progress', 'resolved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      RPT_AdminNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reports');
  },
};
