const invitationService = require('../services/invitationService');
const ServerError = require('../errors/ServerError');
const { ROLES } = require('../utils/constants');

module.exports = {
  createInvitation: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.AGENCY) {
        return next(
          new ServerError('Forbidden: Only agencies can send invitations', 403)
        );
      }

      const { CST_ID, MOD_ID } = req.body;
      if (!CST_ID || !MOD_ID) {
        return next(
          new ServerError('Casting ID and Model ID are required', 400)
        );
      }

      const invitation = await invitationService.createInvitation(
        req.user.id,
        CST_ID,
        MOD_ID
      );

      res.status(201).json(invitation);
    } catch (err) {
      if (err.message.includes('Forbidden'))
        return next(new ServerError(err.message, 403));
      if (err.message.includes('not found'))
        return next(new ServerError(err.message, 404));
      if (
        err.message.includes('already exists') ||
        err.message.includes('already applied')
      ) {
        return next(new ServerError(err.message, 409));
      }
      next(err);
    }
  },

  getMySentInvitations: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.AGENCY) {
        return next(new ServerError('Forbidden', 403));
      }

      const invitations = await invitationService.getAgencySentInvitations(
        req.user.id
      );
      res.status(200).json(invitations);
    } catch (err) {
      next(err);
    }
  },

  getMyInvitations: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.MODEL) {
        return next(new ServerError('Forbidden', 403));
      }

      const invitations = await invitationService.getModelInvitations(
        req.user.id
      );
      res.status(200).json(invitations);
    } catch (err) {
      next(err);
    }
  },

  respondToInvitation: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.MODEL) {
        return next(new ServerError('Forbidden: Only models can respond', 403));
      }

      const { status } = req.body;
      const { id } = req.params;

      const updatedInvitation = await invitationService.respondToInvitation(
        req.user.id,
        id,
        status
      );

      res.status(200).json(updatedInvitation);
    } catch (err) {
      if (
        err.message.includes('Invalid status') ||
        err.message.includes('already been')
      ) {
        return next(new ServerError(err.message, 400));
      }
      if (err.message.includes('Forbidden'))
        return next(new ServerError(err.message, 403));
      if (err.message.includes('not found'))
        return next(new ServerError(err.message, 404));
      next(err);
    }
  },
};
