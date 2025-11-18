const db = require('../models');
const { Op } = require('sequelize');
const ServerError = require('../errors/ServerError');
const pdfService = require('../services/PdfService');

const formatAddress = (city, type) => {
  if (type === 'remote') return 'Remote Work';
  return city || 'Location TBA';
};

const formatDateRange = (start, end) => {
  if (!start) return 'To Be Announced';
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const startDate = new Date(start).toLocaleDateString('en-US', options);
  if (end) {
    const endDate = new Date(end).toLocaleDateString('en-US', options);
    return `${startDate} – ${endDate}`;
  }
  return startDate;
};

const formatRequirement = (min, max, unit) => {
  if (min && max) return `${min} - ${max} ${unit}`;
  if (min) return `${min}+ ${unit}`;
  if (max) return `Up to ${max} ${unit}`;
  return 'Any';
};

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
            attributes: [
              'CST_ID',
              'CST_Title',
              'CST_CoverImage',
              'CST_Payment',
            ],
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
              'CST_CoverImage',
              'CST_Payment',
              'CST_Gender',
              'CST_AgeMin',
              'CST_AgeMax',
              'CST_HeightMin',
              'CST_HeightMax',
              'CST_City',
              'CST_LocationType',
              'CST_StartDate',
              'CST_EndDate',
              'CST_Description',
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
      const { status, rejectionReason, invitationText } = req.body;

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

      if (status === 'rejected' && rejectionReason) {
        application.APP_RejectionReason = rejectionReason;
      }

      if (status === 'accepted' && invitationText) {
        application.APP_InvitationText = invitationText;
      }

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
              'CST_CoverImage',
              'CST_Payment',
              'CST_Gender',
              'CST_AgeMin',
              'CST_AgeMax',
              'CST_HeightMin',
              'CST_HeightMax',
              'CST_City',
              'CST_LocationType',
              'CST_StartDate',
              'CST_EndDate',
              'CST_Description',
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
  downloadInvite: async (req, res, next) => {
    try {
      const { id } = req.params;

      const application = await db.Application.findByPk(id, {
        include: [
          {
            model: db.Casting,
            as: 'Casting',
            include: [{ model: db.Agency, as: 'Agency' }],
          },
          { model: db.Model, as: 'Model' },
        ],
      });

      if (!application) {
        throw new ServerError('Application not found', 404);
      }

      if (req.user.role === 'agency') {
        const agency = await getAgencyProfile(req.user.id);
        if (application.Casting.Agency.AGN_ID !== agency.AGN_ID) {
          throw new ServerError('Forbidden: You do not own this casting', 403);
        }
      } else if (req.user.role === 'model') {
        const model = await getModelProfile(req.user.id);
        if (application.Model.MOD_ID !== model.MOD_ID) {
          throw new ServerError('Forbidden: This is not your application', 403);
        }
      } else {
        throw new ServerError('Forbidden', 403);
      }

      if (
        application.APP_Status !== 'accepted' ||
        !application.APP_InvitationText
      ) {
        throw new ServerError('Invite not finalized or accepted.', 400);
      }

      const formatAddress = (city, type) =>
        type === 'remote' ? 'Remote Work' : city || 'Location TBA';
      const formatRequirement = (min, max, unit) => {
        if (min && max) return `${min} - ${max} ${unit}`;
        if (min) return `${min}+ ${unit}`;
        if (max) return `Up to ${max} ${unit}`;
        return 'Any';
      };
      const formatDateRange = (start, end) => {
        if (!start) return 'To Be Announced';
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const s = new Date(start).toLocaleDateString('en-US', options);
        return end
          ? `${s} – ${new Date(end).toLocaleDateString('en-US', options)}`
          : s;
      };

      const dataForTemplate = {
        model: application.Model,
        agency: application.Casting.Agency,
        casting: application.Casting,
        invitationText: application.APP_InvitationText,
        formatted: {
          payment: application.Casting.CST_Payment
            ? `$${application.Casting.CST_Payment}`
            : 'Negotiable',
          address: formatAddress(
            application.Casting.CST_City,
            application.Casting.CST_LocationType
          ),
          dates: formatDateRange(
            application.Casting.CST_StartDate,
            application.Casting.CST_EndDate
          ),
          ageReq: formatRequirement(
            application.Casting.CST_AgeMin,
            application.Casting.CST_AgeMax,
            ''
          ),
          heightReq: formatRequirement(
            application.Casting.CST_HeightMin,
            application.Casting.CST_HeightMax,
            'cm'
          ),
          agencyLogo: application.Casting.Agency.AGN_Logo
            ? `http://localhost:5001${application.Casting.Agency.AGN_Logo}`
            : null,
          coverImage: application.Casting.CST_CoverImage
            ? `http://localhost:5001${application.Casting.CST_CoverImage}`
            : null,
          agencyName: application.Casting.Agency.AGN_Name || 'LipaX Agency',
        },
      };

      const pdfBuffer = await pdfService.generatePdf('invite', dataForTemplate);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=LipaX_Invite_${application.Casting.CST_ID}.pdf`
      );
      res.send(pdfBuffer);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      next(err);
    }
  },
  downloadRejection: async (req, res, next) => {
    try {
      const { id } = req.params;

      const application = await db.Application.findByPk(id, {
        include: [
          {
            model: db.Casting,
            as: 'Casting',
            include: [{ model: db.Agency, as: 'Agency' }],
          },
          { model: db.Model, as: 'Model' },
        ],
      });

      if (!application) throw new ServerError('Application not found', 404);

      if (req.user.role === 'agency') {
        const agency = await getAgencyProfile(req.user.id);
        if (application.Casting.Agency.AGN_ID !== agency.AGN_ID) {
          throw new ServerError('Forbidden', 403);
        }
      } else if (req.user.role === 'model') {
        const model = await getModelProfile(req.user.id);
        if (application.Model.MOD_ID !== model.MOD_ID) {
          throw new ServerError('Forbidden', 403);
        }
      } else {
        throw new ServerError('Forbidden', 403);
      }

      if (
        application.APP_Status !== 'rejected' ||
        !application.APP_RejectionReason
      ) {
        throw new ServerError('Rejection letter not available.', 400);
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
            ? `http://localhost:5001${application.Casting.Agency.AGN_Logo}`
            : null,
          agencyName: application.Casting.Agency.AGN_Name || 'LipaX Agency',
        },
      };

      const pdfBuffer = await pdfService.generatePdf(
        'rejection',
        dataForTemplate
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=Rejection_${application.Casting.CST_ID}.pdf`
      );
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  },
};
