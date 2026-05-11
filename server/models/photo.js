'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    static associate (models) {
      Photo.belongsTo(models.Album, { foreignKey: 'PH_AlbumID', as: 'Album' })
    }
  }

  Photo.init(
    {
      PH_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      PH_AlbumID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Albums',
          key: 'ALB_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      PH_Url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      PH_Title: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Photo',
      tableName: 'Photos'
    }
  )

  return Photo
}
