'use strict'
const { Model: SequelizeModel } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class AdminAction extends SequelizeModel {
    static associate (models) {
      // Адміністратор (User)
      AdminAction.belongsTo(models.User, { foreignKey: 'USR_ID', as: 'Admin' })
    }
  }

  AdminAction.init(
    {
      ACT_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      USR_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'USR_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ACT_Type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ACT_TargetID: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'AdminAction',
      tableName: 'AdminActions'
    }
  )

  return AdminAction
}
