const applicationService = require('../services/applicationService');
const ServerError = require('../errors/ServerError');
const { ROLES } = require('../utils/constants');

module.exports = {
  createApplication: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.MODEL) {
        return next(new ServerError('Forbidden', 403));
      }
      const { CST_ID } = req.body;
      if (!CST_ID) {
        return next(new ServerError('Casting ID is required', 400));
      }

      const application = await applicationService.createApplication(
        req.user.id,
        CST_ID
      );
      res.status(201).json(application);
    } catch (err) {
      if (err.message.includes('already applied'))
        return next(new ServerError(err.message, 409));
      if (err.message.includes('not found'))
        return next(new ServerError(err.message, 404));
      next(err);
    }
  },

  getMyApplications: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.MODEL)
        return next(new ServerError('Forbidden', 403));

      const applications = await applicationService.getModelApplications(
        req.user.id
      );
      res.json(applications);
    } catch (err) {
      next(err);
    }
  },

  getAgencyApplications: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.AGENCY)
        return next(new ServerError('Forbidden', 403));

      const applications = await applicationService.getAllAgencyApplications(
        req.user.id
      );
      res.json(applications);
    } catch (err) {
      next(err);
    }
  },

  getApplicationsForCasting: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.AGENCY)
        return next(new ServerError('Forbidden', 403));

      const applications = await applicationService.getApplicationsForCasting(
        req.user.id,
        req.params.id
      );
      res.json(applications);
    } catch (err) {
      if (err.message.includes('Forbidden'))
        return next(new ServerError(err.message, 403));
      if (err.message.includes('not found'))
        return next(new ServerError(err.message, 404));
      next(err);
    }
  },

  respondToApplication: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.AGENCY)
        return next(new ServerError('Forbidden', 403));

      const { status, rejectionReason, invitationText } = req.body;
      const result = await applicationService.respondToApplication(
        req.user.id,
        req.params.id,
        {
          status,
          rejectionReason,
          invitationText,
        }
      );

      res.json(result);
    } catch (err) {
      if (
        err.message.includes('Invalid status') ||
        err.message.includes('already been')
      ) {
        return next(new ServerError(err.message, 400));
      }
      if (err.message.includes('Forbidden'))
        return next(new ServerError(err.message, 403));
      if (err.message === 'Application not found')
        return next(new ServerError(err.message, 404));
      next(err);
    }
  },

  downloadInvite: async (req, res, next) => {
    try {
      const { buffer, filename } = await applicationService.generateInvitePdf(
        req.user.id,
        req.user.role,
        req.params.id
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (err) {
      if (err.message.includes('Forbidden'))
        return next(new ServerError(err.message, 403));
      if (err.message.includes('not finalized'))
        return next(new ServerError(err.message, 400));
      next(err);
    }
  },

  downloadRejection: async (req, res, next) => {
    try {
      const { buffer, filename } =
        await applicationService.generateRejectionPdf(
          req.user.id,
          req.user.role,
          req.params.id
        );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (err) {
      if (err.message.includes('Forbidden'))
        return next(new ServerError(err.message, 403));
      if (err.message.includes('not available'))
        return next(new ServerError(err.message, 400));
      next(err);
    }
  },
};
