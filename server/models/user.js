'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      // 1:1 з Model (якщо роль = 'model')
      User.hasOne(models.Model, { foreignKey: 'USR_ID' })

      // 1:1 з Agency (якщо роль = 'agency')
      User.hasOne(models.Agency, { foreignKey: 'USR_ID' })

      // 1:N Messages (sender)
      User.hasMany(models.Message, {
        foreignKey: 'MSG_SenderID',
        as: 'SentMessages'
      })

      // 1:N Messages (receiver)
      User.hasMany(models.Message, {
        foreignKey: 'MSG_ReceiverID',
        as: 'ReceivedMessages'
      })

      // 1:N AdminActions
      User.hasMany(models.AdminAction, { foreignKey: 'USR_ID' })
    }
  }

  User.init(
    {
      USR_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      USR_Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      USR_PasswordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      USR_Role: {
        type: DataTypes.ENUM('model', 'agency', 'admin'),
        allowNull: false
      },
      USR_AccessToken: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users'
    }
  )

  return User
}
