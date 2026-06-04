const modelService = require('../services/modelService');
const ServerError = require('../errors/ServerError');
const { ROLES } = require('../utils/constants');

module.exports = {
  getProfile: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.MODEL) {
        return next(new ServerError('Forbidden', 403));
      }

      const model = await modelService.getMyProfile(req.user.id);
      res.json(model);
    } catch (err) {
      if (err.message === 'Profile not found')
        return next(new ServerError(err.message, 404));
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.MODEL) {
        return next(new ServerError('Forbidden', 403));
      }

      const updatedModel = await modelService.updateProfile(
        req.user.id,
        req.body
      );

      res.json({
        message: 'Profile updated successfully',
        model: updatedModel,
      });
    } catch (err) {
      if (err.message === 'Profile not found')
        return next(new ServerError(err.message, 404));
      next(err);
    }
  },

  updatePhoto: async (req, res, next) => {
    try {
      if (req.user.role !== ROLES.MODEL) {
        return next(new ServerError('Forbidden', 403));
      }

      if (!req.file) {
        return next(new ServerError('No file uploaded', 400));
      }

      const result = await modelService.updatePhoto(
        req.user.id,
        req.file.filename
      );

      res.json(result);
    } catch (err) {
      if (err.message === 'Profile not found')
        return next(new ServerError(err.message, 404));
      next(err);
    }
  },

  getModels: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;

      const models = await modelService.getAllPublicModels(page, limit);
      res.json(models);
    } catch (err) {
      next(err);
    }
  },

  getModel: async (req, res, next) => {
    try {
      const { id } = req.params;
      const isAdmin = req.user && req.user.role === 'admin';

      const model = await modelService.getPublicModelById(id, isAdmin);
      res.json(model);
    } catch (err) {
      if (err.message === 'Model not found')
        return next(new ServerError(err.message, 404));
      next(err);
    }
  },
};
