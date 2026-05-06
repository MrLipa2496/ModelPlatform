'use strict';
const { Model: SequelizeModel } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Report extends SequelizeModel {
    static associate (models) {
      Report.belongsTo(models.User, {
        foreignKey: 'USR_ID',
        as: 'Sender',
      });

      Report.belongsTo(models.User, {
        foreignKey: 'RPT_ReportedUserID',
        as: 'ReportedUser',
      });
    }
  }

  Report.init(
    {
      RPT_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      USR_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'USR_ID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      RPT_ReportedUserID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'USR_ID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      RPT_Type: {
        type: DataTypes.ENUM('complaint', 'suggestion', 'technical', 'other'),
        allowNull: false,
        defaultValue: 'other',
      },
      RPT_Subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      RPT_Message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      RPT_Attachment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      RPT_Status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'rejected'),
        defaultValue: 'pending',
      },
      RPT_AdminNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Report',
      tableName: 'Reports',
    }
  );

  return Report;
};
