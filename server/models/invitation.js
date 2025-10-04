'use strict'
const { Model: SequelizeModel } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Invitation extends SequelizeModel {
    static associate (models) {
      // 1:1 з Casting
      Invitation.belongsTo(models.Casting, {
        foreignKey: 'CST_ID',
        as: 'Casting'
      })

      // 1:1 з Agency
      Invitation.belongsTo(models.Agency, {
        foreignKey: 'AGN_ID',
        as: 'Agency'
      })

      // 1:1 з Model
      Invitation.belongsTo(models.Model, { foreignKey: 'MOD_ID', as: 'Model' })
    }
  }

  Invitation.init(
    {
      INV_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      CST_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Castings',
          key: 'CST_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      MOD_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Models',
          key: 'MOD_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      INV_Status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
      },
      INV_SentAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Invitation',
      tableName: 'Invitations'
    }
  )

  return Invitation
}
