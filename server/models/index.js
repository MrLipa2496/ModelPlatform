const { Sequelize, DataTypes } = require('sequelize');
const User = require('./user.js');
const Model = require('./model.js');
const Agency = require('./agency.js');
const AdminAction = require('./adminaction.js');
const Album = require('./album.js');
const Application = require('./application.js');
const Casting = require('./casting.js');
const Invitation = require('./invitation.js');
const Message = require('./message.js');
const Photo = require('./photo.js');
const Report = require('./report.js');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/db.js')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {
  sequelize,
  Sequelize,
  User: User(sequelize, DataTypes),
  Model: Model(sequelize, DataTypes),
  Agency: Agency(sequelize, DataTypes),
  AdminAction: AdminAction(sequelize, DataTypes),
  Album: Album(sequelize, DataTypes),
  Application: Application(sequelize, DataTypes),
  Casting: Casting(sequelize, DataTypes),
  Invitation: Invitation(sequelize, DataTypes),
  Message: Message(sequelize, DataTypes),
  Photo: Photo(sequelize, DataTypes),
  Report: Report(sequelize, DataTypes),
};

Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

module.exports = db;
