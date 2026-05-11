const reportService = require('../services/reportService');
const ServerError = require('../errors/ServerError');

module.exports = {
  createReport: async (req, res, next) => {
    try {
      const { subject, message, type } = req.body;

      if (!subject || !message) {
        return next(
          new ServerError('Subject and message are required fields', 400)
        );
      }

      const validTypes = ['complaint', 'suggestion', 'technical', 'other'];
      if (type && !validTypes.includes(type)) {
        return next(new ServerError('Invalid report type', 400));
      }

      const report = await reportService.createReport(
        req.user.id,
        req.body,
        req.file
      );

      res.status(201).json(report);
    } catch (err) {
      if (err.message.includes('does not exist')) {
        return next(new ServerError(err.message, 404));
      }
      next(err);
    }
  },

  getMyReports: async (req, res, next) => {
    try {
      const reports = await reportService.getMyReports(req.user.id);
      res.status(200).json(reports);
    } catch (err) {
      next(err);
    }
  },
};
