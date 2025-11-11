const db = require('../models');
const { Op } = require('sequelize');
const ServerError = require('../errors/ServerError');

const getAgencyProfile = async userId => {
  const agency = await db.Agency.findOne({ where: { USR_ID: userId } });
  if (!agency) {
    throw new ServerError('Agency profile not found for this user', 404);
  }
  return agency;
};

const getModelProfile = async userId => {
  const model = await db.Model.findOne({ where: { USR_ID: userId } });
  if (!model) {
    throw new ServerError('Model profile not found for this user', 404);
  }
  return model;
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
  createInvitation: async (req, res, next) => {
    try {
      if (req.user.role !== 'agency') {
        throw new ServerError(
          'Forbidden: Only agencies can send invitations',
          403
        );
      }

      const { CST_ID, MOD_ID } = req.body;
      if (!CST_ID || !MOD_ID) {
        throw new ServerError('Casting ID and Model ID are required', 400);
      }

      const agency = await getAgencyProfile(req.user.id);

      const model = await db.Model.findByPk(MOD_ID);
      if (!model) {
        throw new ServerError('Model not found', 404);
      }

      await checkCastingOwnership(CST_ID, agency.AGN_ID);

      const existingInvitation = await db.Invitation.findOne({
        where: { CST_ID, MOD_ID },
      });
      if (existingInvitation) {
        throw new ServerError(
          'An invitation for this model to this casting already exists',
          409
        );
      } // TODO: Додаткова перевірка - чи не подала модель вже заявку (Application) // const existingApplication = await db.Application.findOne(...); // if (existingApplication) ... // 5. Створити запрошення

      const newInvitation = await db.Invitation.create({
        CST_ID,
        MOD_ID,
        AGN_ID: agency.AGN_ID,
        INV_Status: 'pending',
      });

      res.status(201).json(newInvitation);
    } catch (err) {
      next(err);
    }
  },
  getMySentInvitations: async (req, res, next) => {
    try {
      if (req.user.role !== 'agency') {
        throw new ServerError('Forbidden', 403);
      }

      const agency = await getAgencyProfile(req.user.id);

      const invitations = await db.Invitation.findAll({
        where: { AGN_ID: agency.AGN_ID },
        include: [
          {
            model: db.Model,
            as: 'Model',
            attributes: [
              'MOD_ID',
              'MOD_FirstName',
              'MOD_LastName',
              'MOD_Photo',
            ],
          },
          {
            model: db.Casting,
            as: 'Casting',
            attributes: ['CST_ID', 'CST_Title'],
          },
        ],
        order: [['INV_SentAt', 'DESC']],
      });

      res.status(200).json(invitations);
    } catch (err) {
      next(err);
    }
  },
  getMyInvitations: async (req, res, next) => {
    try {
      if (req.user.role !== 'model') {
        throw new ServerError('Forbidden', 403);
      }

      const model = await getModelProfile(req.user.id);

      const invitations = await db.Invitation.findAll({
        where: { MOD_ID: model.MOD_ID },
        include: [
          {
            model: db.Agency,
            as: 'Agency',
            attributes: ['AGN_ID', 'AGN_Name', 'AGN_Logo'],
          },
          {
            model: db.Casting,
            as: 'Casting',
            attributes: ['CST_ID', 'CST_Title'],
          },
        ],
        order: [['INV_SentAt', 'DESC']],
      });

      res.status(200).json(invitations);
    } catch (err) {
      next(err);
    }
  },
  respondToInvitation: async (req, res, next) => {
    try {
      if (req.user.role !== 'model') {
        throw new ServerError(
          'Forbidden: Only models can respond to invitations',
          403
        );
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!['accepted', 'rejected'].includes(status)) {
        throw new ServerError(
          'Invalid status. Must be "accepted" or "rejected"',
          400
        );
      }

      const model = await getModelProfile(req.user.id);

      const invitation = await db.Invitation.findByPk(id);
      if (!invitation) {
        throw new ServerError('Invitation not found', 404);
      }

      if (invitation.MOD_ID !== model.MOD_ID) {
        throw new ServerError('Forbidden: This invitation is not for you', 403);
      }

      if (invitation.INV_Status !== 'pending') {
        throw new ServerError(
          `This invitation has already been ${invitation.INV_Status}`,
          400
        );
      }

      invitation.INV_Status = status;
      await invitation.save(); // TODO: Якщо 'accepted', можливо, автоматично створити 'Application' // (або розглядати 'accepted' запрошення як еквівалент схваленої заявки)

      res.status(200).json(invitation);
    } catch (err) {
      next(err);
    }
  },
};
