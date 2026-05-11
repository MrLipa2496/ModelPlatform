'use strict';
const { Model: SequelizeModel } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Agency extends SequelizeModel {
    static associate (models) {
      // 1:1 з User
      Agency.belongsTo(models.User, { foreignKey: 'USR_ID', as: 'User' });

      // 1:N Castings
      Agency.hasMany(models.Casting, { foreignKey: 'AGN_ID', as: 'Castings' });

      // 1:N Invitations
      Agency.hasMany(models.Invitation, {
        foreignKey: 'AGN_ID',
        as: 'Invitations',
      });
    }
  }

  Agency.init(
    {
      AGN_ID: {
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
      AGN_Name: { type: DataTypes.STRING, allowNull: false },
      AGN_Logo: { type: DataTypes.STRING },
      AGN_Description: { type: DataTypes.TEXT },
      AGN_Phone: { type: DataTypes.STRING },
      AGN_Website: { type: DataTypes.STRING },
      AGN_Country: { type: DataTypes.STRING },
      AGN_City: { type: DataTypes.STRING },
      AGN_Verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      AGN_Status: {
        type: DataTypes.ENUM('active', 'blocked', 'pending'),
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'Agency',
      tableName: 'Agencies',
    }
  );

  return Agency;
};
