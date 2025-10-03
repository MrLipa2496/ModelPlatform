'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Models', {
      MOD_ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MOD_USR_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'USR_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      MOD_FirstName: { type: Sequelize.STRING, allowNull: false },
      MOD_LastName: { type: Sequelize.STRING, allowNull: false },
      MOD_Gender: { type: Sequelize.STRING },
      MOD_BirthDate: { type: Sequelize.DATE },
      MOD_Height: { type: Sequelize.INTEGER },
      MOD_Weight: { type: Sequelize.INTEGER },
      MOD_EyeColor: { type: Sequelize.STRING },
      MOD_HairColor: { type: Sequelize.STRING },
      MOD_Experience: { type: Sequelize.STRING },
      MOD_Skills: { type: Sequelize.JSON },
      MOD_Bio: { type: Sequelize.TEXT },
      MOD_Photo: { type: Sequelize.STRING },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Models')
  }
}
