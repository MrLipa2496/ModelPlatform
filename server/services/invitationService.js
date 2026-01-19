const db = require('../models');
const { STATUS } = require('../utils/constants');

class InvitationService {
  async createInvitation (userId, castingId, modelId) {
    const agency = await this._getAgencyProfile(userId);

    const model = await db.Model.findByPk(modelId);
    if (!model) throw new Error('Model not found');

    const casting = await db.Casting.findByPk(castingId);
    if (!casting) throw new Error('Casting not found');
    if (casting.AGN_ID !== agency.AGN_ID)
      throw new Error('Forbidden: You do not own this casting');

    const existingApplication = await db.Application.findOne({
      where: { CST_ID: castingId, MOD_ID: modelId },
    });
    if (existingApplication) {
      throw new Error('Model has already applied to this casting');
    }

    const existingInvitation = await db.Invitation.findOne({
      where: { CST_ID: castingId, MOD_ID: modelId },
    });
    if (existingInvitation) {
      throw new Error(
        'An invitation for this model to this casting already exists'
      );
    }

    return await db.Invitation.create({
      CST_ID: castingId,
      MOD_ID: modelId,
      AGN_ID: agency.AGN_ID,
      INV_Status: STATUS.PENDING,
    });
  }

  async getAgencySentInvitations (userId) {
    const agency = await this._getAgencyProfile(userId);

    return await db.Invitation.findAll({
      where: { AGN_ID: agency.AGN_ID },
      include: [
        {
          model: db.Model,
          as: 'Model',
          attributes: ['MOD_ID', 'MOD_FirstName', 'MOD_LastName', 'MOD_Photo'],
        },
        {
          model: db.Casting,
          as: 'Casting',
          attributes: ['CST_ID', 'CST_Title'],
        },
      ],
      order: [['INV_SentAt', 'DESC']],
    });
  }

  async getModelInvitations (userId) {
    const model = await this._getModelProfile(userId);

    return await db.Invitation.findAll({
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
  }

  async respondToInvitation (userId, invitationId, status) {
    if (![STATUS.ACCEPTED, STATUS.REJECTED].includes(status)) {
      throw new Error('Invalid status. Must be "accepted" or "rejected"');
    }

    const t = await db.sequelize.transaction();

    try {
      const model = await this._getModelProfile(userId);

      const invitation = await db.Invitation.findByPk(invitationId, {
        transaction: t,
      });
      if (!invitation) throw new Error('Invitation not found');

      if (invitation.MOD_ID !== model.MOD_ID) {
        throw new Error('Forbidden: This invitation is not for you');
      }

      if (invitation.INV_Status !== STATUS.PENDING) {
        throw new Error(
          `This invitation has already been ${invitation.INV_Status}`
        );
      }

      invitation.INV_Status = status;
      await invitation.save({ transaction: t });

      if (status === STATUS.ACCEPTED) {
        const existingApp = await db.Application.findOne({
          where: { CST_ID: invitation.CST_ID, MOD_ID: model.MOD_ID },
          transaction: t,
        });

        if (!existingApp) {
          await db.Application.create(
            {
              MOD_ID: model.MOD_ID,
              CST_ID: invitation.CST_ID,
              APP_Status: STATUS.PENDING,
            },
            { transaction: t }
          );
        }
      }

      await t.commit();
      return invitation;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async _getAgencyProfile (userId) {
    const agency = await db.Agency.findOne({ where: { USR_ID: userId } });
    if (!agency) throw new Error('Agency profile not found for this user');
    return agency;
  }

  async _getModelProfile (userId) {
    const model = await db.Model.findOne({ where: { USR_ID: userId } });
    if (!model) throw new Error('Model profile not found for this user');
    return model;
  }
}

module.exports = new InvitationService();
