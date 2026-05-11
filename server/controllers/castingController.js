const castingService = require('../services/castingService');
const ServerError = require('../errors/ServerError');
const { ROLES, STATUS } = require('../utils/constants');

module.exports = {
  createCasting: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.AGENCY) {
        return next(
          new ServerError('Forbidden: Only agencies can create castings', 403)
        );
      }
      const newCasting = await castingService.createCasting(
        req.user.id,
        req.body,
        req.file
      );

      res.status(201).json(newCasting);
    } catch (err) {
      if (err.message.includes('Forbidden'))
        return next(new ServerError(err.message, 403));
      next(err);
    }
  },

  getAllCastings: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;

      const castings = await castingService.getAllPublicCastings(page, limit);
      res.status(200).json(castings);
    } catch (err) {
      next(err);
    }
  },

  getCastingById: async (req, res, next) => {
    try {
      const castingId = req.params.id;
      let casting;

      const unfilteredCasting = await castingService.getCastingByIdUnfiltered(
        castingId
      );

      const isAdmin = req.user && req.user.role === 'admin';

      let isOwner = false;
      if (req.user && req.user.role === 'agency') {
        const userAgency = await db.Agency.findOne({
          where: { USR_ID: req.user.id },
        });
        if (userAgency && unfilteredCasting.AGN_ID === userAgency.AGN_ID) {
          isOwner = true;
        }
      }

      if (isAdmin || isOwner) {
        casting = unfilteredCasting;
      } else {
        if (
          ![STATUS.ACTIVE, STATUS.APPROVED].includes(
            unfilteredCasting.CST_Status
          )
        ) {
          return next(new ServerError('Casting not found or not active', 404));
        }
        casting = unfilteredCasting;
      }

      res.status(200).json(casting);
    } catch (err) {
      if (err.message.includes('not found'))
        return next(new ServerError(err.message, 404));
      next(err);
    }
  },

  getMyCastings: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.AGENCY) {
        return next(new ServerError('Forbidden', 403));
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;

      const castings = await castingService.getMyCastings(
        req.user.id,
        page,
        limit
      );
      res.status(200).json(castings);
    } catch (err) {
      next(err);
    }
  },

  updateCasting: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.AGENCY) {
        return next(new ServerError('Forbidden', 403));
      }

      const { CST_Status, ...updateData } = req.body;

      const updatedCasting = await castingService.updateCasting(
        req.user.id,
        req.params.id,
        updateData,
        req.file
      );

      res.status(200).json(updatedCasting);
    } catch (err) {
      if (err.message.includes('Forbidden'))
        return next(new ServerError(err.message, 403));
      if (err.message === 'Casting not found')
        return next(new ServerError(err.message, 404));
      next(err);
    }
  },

  deleteCasting: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.AGENCY) {
        return next(new ServerError('Forbidden', 403));
      }

      await castingService.deleteCasting(req.user.id, req.params.id);

      res.status(200).json({ message: 'Casting deleted successfully' });
    } catch (err) {
      if (err.message.includes('Forbidden'))
        return next(new ServerError(err.message, 403));
      if (err.message === 'Casting not found')
        return next(new ServerError(err.message, 404));
      next(err);
    }
  },
};
