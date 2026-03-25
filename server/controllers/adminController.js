const adminService = require('../services/adminService');
const ServerError = require('../errors/ServerError');

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return next(new ServerError('Forbidden', 403));
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const role = req.query.role;
      const status = req.query.status;

      if (!role) {
        return next(new ServerError('Role query parameter is required', 400));
      }

      const users = await adminService.getUsers({ role, status, page, limit });
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  changeUserStatus: async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return next(new ServerError('Forbidden', 403));
      }

      const { id } = req.params;
      const { status, reason } = req.body;

      if (!['active', 'blocked', 'pending'].includes(status)) {
        return next(new ServerError('Invalid status', 400));
      }

      const result = await adminService.changeUserStatus(
        req.user.id,
        id,
        status,
        reason
      );

      res.json(result);
    } catch (err) {
      if (
        err.message === 'User not found' ||
        err.message === 'Profile not found'
      ) {
        return next(new ServerError(err.message, 404));
      }
      next(err);
    }
  },

  getCastings: async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return next(new ServerError('Forbidden', 403));
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const status = req.query.status;

      const castings = await adminService.getCastings({ status, page, limit });
      res.json(castings);
    } catch (err) {
      next(err);
    }
  },

  changeCastingStatus: async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return next(new ServerError('Forbidden', 403));
      }

      const { id } = req.params;
      const { status, reason } = req.body;

      const result = await adminService.changeCastingStatus(
        req.user.id,
        id,
        status,
        reason
      );

      res.json(result);
    } catch (err) {
      if (err.message === 'Casting not found') {
        return next(new ServerError(err.message, 404));
      }
      next(err);
    }
  },
};
