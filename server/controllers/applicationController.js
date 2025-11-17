const db = require('../models');
const { Op } = require('sequelize');
const ServerError = require('../errors/ServerError');

const getModelProfile = async userId => {
  const model = await db.Model.findOne({ where: { USR_ID: userId } });
  if (!model) {
    throw new ServerError('Model profile not found for this user', 404);
  }
  return model;
};

const getAgencyProfile = async userId => {
  const agency = await db.Agency.findOne({ where: { USR_ID: userId } });
  if (!agency) {
    throw new ServerError('Agency profile not found for this user', 404);
  }
  return agency;
};

const checkCastingOwnership = async (castingId, agencyId) => {
  const casting = await db.Casting.findByPk(castingId);
  if (!casting) {
    throw new ServerError('Casting not found', 404);
  }
  if (casting.AGN_ID !== agencyId) {
    throw new ServerError('Forbidden: You do not own this casting', 403);
  }
  return casting;
};

module.exports = {
  createApplication: async (req, res, next) => {
    try {
      if (req.user.role !== 'model') {
        throw new ServerError(
          'Forbidden: Only models can create applications',
          403
        );
      }
      const { CST_ID } = req.body;
      if (!CST_ID) {
        throw new ServerError(
          'Casting ID (CST_ID) is required in the body',
          400
        );
      }
      const model = await getModelProfile(req.user.id);
      const casting = await db.Casting.findOne({
        where: {
          CST_ID: CST_ID,
          CST_Status: { [Op.in]: ['active', 'approved'] },
        },
      });
      if (!casting) {
        throw new ServerError('Casting not found or is not active', 404);
      }
      const existingApplication = await db.Application.findOne({
        where: { MOD_ID: model.MOD_ID, CST_ID: CST_ID },
      });
      if (existingApplication) {
        throw new ServerError('You have already applied to this casting', 409);
      }
      const newApplication = await db.Application.create({
        MOD_ID: model.MOD_ID,
        CST_ID: CST_ID,
        APP_Status: 'pending',
      });
      res.status(201).json(newApplication);
    } catch (err) {
      next(err);
    }
  },

  getMyApplications: async (req, res, next) => {
    try {
      if (req.user.role !== 'model') {
        throw new ServerError('Forbidden', 403);
      }
      const model = await getModelProfile(req.user.id);
      const applications = await db.Application.findAll({
        where: { MOD_ID: model.MOD_ID },
        include: [
          {
            model: db.Casting,
            as: 'Casting',
            attributes: ['CST_ID', 'CST_Title'],
            include: [
              {
                model: db.Agency,
                as: 'Agency',
                attributes: ['AGN_ID', 'AGN_Name', 'AGN_Logo'],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      res.status(200).json(applications);
    } catch (err) {
      next(err);
    }
  },

  getApplicationsForCasting: async (req, res, next) => {
    try {
      if (req.user.role !== 'agency') {
        throw new ServerError('Forbidden', 403);
      }

      const { id } = req.params;
      const agency = await getAgencyProfile(req.user.id);

      await checkCastingOwnership(id, agency.AGN_ID);

      const applications = await db.Application.findAll({
        where: { CST_ID: id },
        include: [
          {
            model: db.Model,
            as: 'Model',
            attributes: [
              'MOD_ID',
              'MOD_FirstName',
              'MOD_LastName',
              'MOD_Photo',
              'MOD_BirthDate',
              'MOD_Height',
              'MOD_Gender',
            ],
          },
          {
            model: db.Casting,
            as: 'Casting',
            attributes: [
              'CST_ID',
              'CST_Title',
              'CST_Gender',
              'CST_AgeMin',
              'CST_AgeMax',
              'CST_HeightMin',
              'CST_HeightMax',
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json(applications);
    } catch (err) {
      next(err);
    }
  },

  respondToApplication: async (req, res, next) => {
    try {
      if (req.user.role !== 'agency') {
        throw new ServerError('Forbidden: Only agencies can respond', 403);
      }
      const { id } = req.params;
      const { status } = req.body;
      if (!['accepted', 'rejected'].includes(status)) {
        throw new ServerError(
          'Invalid status. Must be "accepted" or "rejected"',
          400
        );
      }
      const agency = await getAgencyProfile(req.user.id);
      const application = await db.Application.findByPk(id, {
        include: [
          {
            model: db.Casting,
            as: 'Casting',
            attributes: ['AGN_ID'],
          },
        ],
      });
      if (!application) {
        throw new ServerError('Application not found', 404);
      }
      if (application.Casting.AGN_ID !== agency.AGN_ID) {
        throw new ServerError(
          'Forbidden: This application is not for your agency',
          403
        );
      }
      if (application.APP_Status !== 'pending') {
        throw new ServerError(
          `This application has already been ${application.APP_Status}`,
          400
        );
      }
      application.APP_Status = status;
      await application.save();

      res.status(200).json(application);
    } catch (err) {
      next(err);
    }
  },

  getAgencyApplications: async (req, res, next) => {
    try {
      if (req.user.role !== 'agency') {
        throw new ServerError('Forbidden: Only agencies can access this', 403);
      }

      const agency = await getAgencyProfile(req.user.id);

      const agencyCastings = await db.Casting.findAll({
        where: { AGN_ID: agency.AGN_ID },
        attributes: ['CST_ID'],
      });

      const castingIds = agencyCastings.map(casting => casting.CST_ID);

      if (castingIds.length === 0) {
        return res.status(200).json([]);
      }

      const applications = await db.Application.findAll({
        where: {
          CST_ID: {
            [Op.in]: castingIds,
          },
        },
        include: [
          {
            model: db.Model,
            as: 'Model',
            attributes: [
              'MOD_ID',
              'MOD_FirstName',
              'MOD_LastName',
              'MOD_Photo',
              'MOD_BirthDate',
              'MOD_Height',
              'MOD_Gender',
            ],
          },
          {
            model: db.Casting,
            as: 'Casting',
            attributes: [
              'CST_ID',
              'CST_Title',
              'CST_Gender',
              'CST_AgeMin',
              'CST_AgeMax',
              'CST_HeightMin',
              'CST_HeightMax',
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json(applications);
    } catch (err) {
      next(err);
    }
  },
};
