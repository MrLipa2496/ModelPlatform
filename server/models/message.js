'use strict'
const { Model: SequelizeModel } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Message extends SequelizeModel {
    static associate (models) {
      // Відправник (User)
      Message.belongsTo(models.User, {
        foreignKey: 'MSG_SenderID',
        as: 'Sender'
      })

      // Отримувач (User)
      Message.belongsTo(models.User, {
        foreignKey: 'MSG_ReceiverID',
        as: 'Receiver'
      })
    }
  }

  Message.init(
    {
      MSG_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      MSG_SenderID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'USR_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      MSG_ReceiverID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'USR_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      MSG_Content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'Messages'
    }
  )

  return Message
}
