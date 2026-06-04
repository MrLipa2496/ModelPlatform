'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate (models) {
      // Альбом належить моделі
      Album.belongsTo(models.Model, { foreignKey: 'ALB_ModelID', as: 'Model' })

      Album.hasMany(models.Photo, { foreignKey: 'PH_AlbumID', as: 'Photos' })
    }
  }

  Album.init(
    {
      ALB_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      ALB_ModelID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Models',
          key: 'MOD_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ALB_Title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ALB_Description: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Album',
      tableName: 'Albums'
    }
  )

  return Album
}
