const db = require('../models');
const { Op } = require('sequelize');
const pdfService = require('./PdfService');
const { ROLES, STATUS, PDF_SETTINGS } = require('../utils/constants');
const {
  formatAddress,
  formatDateRange,
  formatRequirement,
} = require('../utils/formatters');

class ApplicationService {
  async createApplication (userId, castingId) {
    const casting = await db.Casting.findOne({
      where: {
        CST_ID: castingId,
        CST_Status: { [Op.in]: [STATUS.ACTIVE, STATUS.APPROVED] },
      },
    });

    if (!casting) throw new Error('Casting not found or is not active');

    const model = await this._getModelProfile(userId);
    const existingApp = await db.Application.findOne({
      where: { MOD_ID: model.MOD_ID, CST_ID: castingId },
    });

    if (existingApp)
      throw new Error('You have already applied to this casting');

    return await db.Application.create({
      MOD_ID: model.MOD_ID,
      CST_ID: castingId,
      APP_Status: STATUS.PENDING,
    });
  }

  async getModelApplications (userId) {
    const model = await this._getModelProfile(userId);

    return await db.Application.findAll({
      where: { MOD_ID: model.MOD_ID },
      include: [
        {
          model: db.Casting,
          as: 'Casting',
          attributes: ['CST_ID', 'CST_Title', 'CST_CoverImage', 'CST_Payment'],
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
  }

  async getApplicationsForCasting (userId, castingId) {
    const agency = await this._getAgencyProfile(userId);

    const casting = await db.Casting.findByPk(castingId);
    if (!casting) throw new Error('Casting not found');
    if (casting.AGN_ID !== agency.AGN_ID)
      throw new Error('Forbidden: You do not own this casting');

    return await db.Application.findAll({
      where: { CST_ID: castingId },
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
  }

  async getAllAgencyApplications (userId) {
    const agency = await this._getAgencyProfile(userId);

    const agencyCastings = await db.Casting.findAll({
      where: { AGN_ID: agency.AGN_ID },
      attributes: ['CST_ID'],
    });

    const castingIds = agencyCastings.map(c => c.CST_ID);
    if (castingIds.length === 0) return [];

    return await db.Application.findAll({
      where: { CST_ID: { [Op.in]: castingIds } },
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
            'CST_CoverImage',
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
  }
  async respondToApplication (
    userId,
    appId,
    { status, rejectionReason, invitationText }
  ) {
    if (![STATUS.ACCEPTED, STATUS.REJECTED].includes(status)) {
      throw new Error('Invalid status');
    }

    const agency = await this._getAgencyProfile(userId);

    const application = await db.Application.findByPk(appId, {
      include: [{ model: db.Casting, as: 'Casting' }],
    });

    if (!application) throw new Error('Application not found');
    if (application.Casting.AGN_ID !== agency.AGN_ID)
      throw new Error('Forbidden');

    if (application.APP_Status !== STATUS.PENDING) {
      throw new Error(
        `This application has already been ${application.APP_Status}`
      );
    }

    application.APP_Status = status;
    if (status === STATUS.REJECTED)
      application.APP_RejectionReason = rejectionReason;
    if (status === STATUS.ACCEPTED)
      application.APP_InvitationText = invitationText;

    await application.save();
    return application;
  }

  async generateInvitePdf (userId, userRole, appId) {
    const application = await this._getAppWithDetails(appId);

    this._checkPdfAccess(application, userId, userRole);

    if (
      application.APP_Status !== STATUS.ACCEPTED ||
      !application.APP_InvitationText
    ) {
      throw new Error('Invite not finalized or accepted.');
    }

    const casting = application.Casting;
    const agency = casting.Agency;

    const dataForTemplate = {
      model: application.Model,
      agency: agency,
      casting: casting,
      invitationText: application.APP_InvitationText,
      formatted: {
        payment: casting.CST_Payment ? `$${casting.CST_Payment}` : 'Negotiable',
        address: formatAddress(casting.CST_City, casting.CST_LocationType),
        dates: formatDateRange(casting.CST_StartDate, casting.CST_EndDate),
        ageReq: formatRequirement(casting.CST_AgeMin, casting.CST_AgeMax, ''),
        heightReq: formatRequirement(
          casting.CST_HeightMin,
          casting.CST_HeightMax,
          'cm'
        ),
        agencyLogo: agency.AGN_Logo
          ? `${PDF_SETTINGS.BASE_URL}${agency.AGN_Logo}`
          : null,
        coverImage: casting.CST_CoverImage
          ? `${PDF_SETTINGS.BASE_URL}${casting.CST_CoverImage}`
          : null,
        agencyName: agency.AGN_Name || 'Model Platform',
      },
    };

    return {
      buffer: await pdfService.generatePdf('invite', dataForTemplate),
      filename: `Invite_${casting.CST_ID}.pdf`,
    };
  }

  async generateRejectionPdf (userId, userRole, appId) {
    const application = await this._getAppWithDetails(appId);

    this._checkPdfAccess(application, userId, userRole);

    if (
      application.APP_Status !== STATUS.REJECTED ||
      !application.APP_RejectionReason
    ) {
      throw new Error('Rejection letter not available.');
    }

    const dataForTemplate = {
      model: application.Model,
      casting: application.Casting,
      rejectionReason: application.APP_RejectionReason,
      formatted: {
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        agencyLogo: application.Casting.Agency.AGN_Logo
          ? `${PDF_SETTINGS.BASE_URL}${application.Casting.Agency.AGN_Logo}`
          : null,
        agencyName: application.Casting.Agency.AGN_Name || 'Model Platform',
      },
    };

    return {
      buffer: await pdfService.generatePdf('rejection', dataForTemplate),
      filename: `Rejection_${application.Casting.CST_ID}.pdf`,
    };
  }

  async _getModelProfile (userId) {
    const model = await db.Model.findOne({ where: { USR_ID: userId } });
    if (!model) throw new Error('Model profile not found');
    return model;
  }

  async _getAgencyProfile (userId) {
    const agency = await db.Agency.findOne({ where: { USR_ID: userId } });
    if (!agency) throw new Error('Agency profile not found');
    return agency;
  }

  async _getAppWithDetails (appId) {
    const app = await db.Application.findByPk(appId, {
      include: [
        {
          model: db.Casting,
          as: 'Casting',
          include: [{ model: db.Agency, as: 'Agency' }],
        },
        { model: db.Model, as: 'Model' },
      ],
    });
    if (!app) throw new Error('Application not found');
    return app;
  }

  _checkPdfAccess (application, userId, userRole) {
    if (userRole === ROLES.AGENCY) {
      if (application.Casting.Agency.USR_ID !== userId) {
        throw new Error('Forbidden: You do not own this casting');
      }
    } else if (userRole === ROLES.MODEL) {
      if (application.Model.USR_ID !== userId) {
        throw new Error('Forbidden: This is not your application');
      }
    } else {
      throw new Error('Forbidden');
    }
  }
}

module.exports = new ApplicationService();
