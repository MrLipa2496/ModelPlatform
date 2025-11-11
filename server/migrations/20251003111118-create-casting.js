'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Castings', {
      CST_ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      AGN_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Agencies',
          key: 'AGN_ID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      CST_Title: { type: Sequelize.STRING, allowNull: false },
      CST_Description: { type: Sequelize.TEXT },
      CST_Requirements: { type: Sequelize.TEXT },
      CST_Payment: { type: Sequelize.DECIMAL },
      CST_Status: {
        type: Sequelize.ENUM(
          'pending',
          'approved',
          'rejected',
          'active',
          'closed'
        ),
        defaultValue: 'pending',
      },
      CST_StartDate: { type: Sequelize.DATE },
      CST_EndDate: { type: Sequelize.DATE },

      CST_CoverImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      CST_Type: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM('any', 'female', 'male', 'non_binary'),
        defaultValue: 'any',
      },
      CST_AgeMin: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      CST_AgeMax: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      CST_HeightMin: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      CST_HeightMax: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      CST_LocationType: {
        type: Sequelize.ENUM('on_site', 'remote'),
        defaultValue: 'on_site',
      },
      CST_Country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      CST_City: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Castings');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Castings_CST_Status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Castings_CST_Type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Castings_CST_Gender";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Castings_CST_LocationType";'
    );
  },
};
