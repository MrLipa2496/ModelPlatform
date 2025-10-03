'use strict'
const { Model: SequelizeModel } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Application extends SequelizeModel {
    static associate (models) {
      // 1:1 з Casting
      Application.belongsTo(models.Casting, {
        foreignKey: 'CST_ID',
        as: 'Casting'
      })

      // 1:1 з Model
      Application.belongsTo(models.Model, { foreignKey: 'MOD_ID', as: 'Model' })
    }
  }

  Application.init(
    {
      APP_ID: {
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
      APP_Status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
      }
    },
    {
      sequelize,
      modelName: 'Application',
      tableName: 'Applications'
    }
  )

  return Application
}
