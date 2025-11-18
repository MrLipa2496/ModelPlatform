'use strict';
const { Model: SequelizeModel } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Casting extends SequelizeModel {
    static associate (models) {
      Casting.belongsTo(models.Agency, { foreignKey: 'AGN_ID', as: 'Agency' });

      Casting.hasMany(models.Application, {
        foreignKey: 'CST_ID',
        as: 'Applications',
      });

      Casting.hasMany(models.Invitation, {
        foreignKey: 'CST_ID',

        as: 'Invitations',
      });
    }
  }

  Casting.init(
    {
      CST_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      AGN_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Agencies', key: 'AGN_ID' },
      },
      CST_Title: { type: DataTypes.STRING, allowNull: false },
      CST_Description: { type: DataTypes.TEXT },
      CST_Requirements: { type: DataTypes.TEXT },
      CST_Payment: { type: DataTypes.DECIMAL },
      CST_Status: {
        type: DataTypes.ENUM(
          'pending',
          'approved',
          'rejected',
          'active',
          'closed'
        ),
        defaultValue: 'pending',
      },
      CST_StartDate: { type: DataTypes.DATE },
      CST_EndDate: { type: DataTypes.DATE },

      CST_CoverImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      CST_Type: {
        type: DataTypes.ENUM(
          'commercial',
          'editorial',
          'runway',
          'promo',
          'tfp',
          'other'
        ),
        defaultValue: 'other',
      },
      CST_Gender: {
        type: DataTypes.STRING,
        defaultValue: 'any',
      },
      CST_AgeMin: { type: DataTypes.INTEGER, allowNull: true },
      CST_AgeMax: { type: DataTypes.INTEGER, allowNull: true },
      CST_HeightMin: { type: DataTypes.INTEGER, allowNull: true },
      CST_HeightMax: { type: DataTypes.INTEGER, allowNull: true },

      CST_LocationType: {
        type: DataTypes.ENUM('on_site', 'remote'),
        defaultValue: 'on_site',
      },
      CST_Country: { type: DataTypes.STRING, allowNull: true },
      CST_City: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Casting',
      tableName: 'Castings',
    }
  );

  return Casting;
};
