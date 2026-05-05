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
      const castingsData = await adminService.getCastings(req.query);
      return res.json(castingsData);
    } catch (error) {
      next(error);
    }
  },

  moderateCasting: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const adminId = req.user.id;

      const result = await adminService.changeCastingStatus(
        adminId,
        id,
        status,
        reason
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },

  getStats: async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return next(new ServerError('Forbidden', 403));
      }
      const stats = await adminService.getDashboardStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  },

  getStatistics: async (req, res) => {
    try {
      const stats = await adminService.getPlatformStatistics();
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ message: 'Failed to load platform statistics' });
    }
  },

  getInvitations: async (req, res, next) => {
    try {
      const { page, limit, status } = req.query;
      const invitations = await adminService.getAllInvitations(
        page ? parseInt(page) : 1,
        limit ? parseInt(limit) : 12,
        status
      );
      res.status(200).json(invitations);
    } catch (err) {
      next(err);
    }
  },
};
