'use strict';
const { Model: SequelizeModel } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Model extends SequelizeModel {
    static associate (models) {
      // 1:1 з User
      Model.belongsTo(models.User, { foreignKey: 'USR_ID', as: 'User' });

      // 1:N Albums
      Model.hasMany(models.Album, { foreignKey: 'ALB_ModelID', as: 'Albums' });

      // 1:N Applications
      Model.hasMany(models.Application, {
        foreignKey: 'MOD_ID',
        as: 'Applications',
      });

      // 1:N Invitations
      Model.hasMany(models.Invitation, {
        foreignKey: 'MOD_ID',
        as: 'Invitations',
      });
    }
  }

  Model.init(
    {
      MOD_ID: {
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
      MOD_FirstName: { type: DataTypes.STRING, allowNull: false },
      MOD_LastName: { type: DataTypes.STRING, allowNull: false },
      MOD_Country: { type: DataTypes.STRING },
      MOD_Gender: { type: DataTypes.STRING },
      MOD_BirthDate: { type: DataTypes.DATE },
      MOD_Height: { type: DataTypes.INTEGER },
      MOD_Weight: { type: DataTypes.INTEGER },
      MOD_EyeColor: { type: DataTypes.STRING },
      MOD_HairColor: { type: DataTypes.STRING },
      MOD_Experience: { type: DataTypes.STRING },
      MOD_Skills: { type: DataTypes.JSON },
      MOD_Verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      MOD_Status: {
        type: DataTypes.ENUM('active', 'blocked', 'pending'),
        defaultValue: 'pending',
      },

      MOD_Bio: { type: DataTypes.TEXT },
      MOD_Photo: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: 'Model',
      tableName: 'Models',
    }
  );

  return Model;
};
