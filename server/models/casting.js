'use strict'
const { Model: SequelizeModel } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Casting extends SequelizeModel {
    static associate (models) {
      // 1:1 з Agency
      Casting.belongsTo(models.Agency, { foreignKey: 'AGN_ID', as: 'Agency' })

      // 1:N Applications
      Casting.hasMany(models.Application, {
        foreignKey: 'CST_ID',
        as: 'Applications'
      })

      // 1:N Invitations
      Casting.hasMany(models.Invitation, {
        foreignKey: 'CST_ID',
        as: 'Invitations'
      })
    }
  }

  Casting.init(
    {
      CST_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      AGN_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Agencies',
          key: 'AGN_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
        defaultValue: 'pending'
      },
      CST_StartDate: { type: DataTypes.DATE },
      CST_EndDate: { type: DataTypes.DATE }
    },
    {
      sequelize,
      modelName: 'Casting',
      tableName: 'Castings'
    }
  )

  return Casting
}
