const agencyService = require('../services/agencyService');
const ServerError = require('../errors/ServerError');
const { ROLES } = require('../utils/constants');

exports.getAgencies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const agencies = await agencyService.getAllPublicAgencies(page, limit);
    res.json(agencies);
  } catch (err) {
    next(err);
  }
};

exports.getAgency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agency = await agencyService.getAgencyWithCastings(id);
    res.json(agency);
  } catch (err) {
    if (err.message === 'Agency not found') {
      return next(new ServerError(err.message, 404));
    }
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.AGENCY) {
      return next(new ServerError('Forbidden', 403));
    }

    const agency = await agencyService.getMyAgencyProfile(req.user.id);
    res.json(agency);
  } catch (err) {
    if (err.message === 'Agency profile not found') {
      return next(new ServerError(err.message, 404));
    }
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.AGENCY) {
      return next(new ServerError('Forbidden', 403));
    }

    const updatedAgency = await agencyService.updateAgencyProfile(
      req.user.id,
      req.body
    );

    res.json(updatedAgency);
  } catch (err) {
    next(err);
  }
};

exports.updateLogo = async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.AGENCY) {
      return next(new ServerError('Forbidden', 403));
    }

    if (!req.file) {
      return next(new ServerError('No logo file uploaded', 400));
    }

    const result = await agencyService.updateAgencyLogo(
      req.user.id,
      req.file.filename
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};
