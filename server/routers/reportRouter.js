const { Router } = require('express');
const reportController = require('../controllers/reportController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

const reportRouter = Router();

reportRouter.post(
  '/',
  auth,
  upload.uploadReportAttachment,
  reportController.createReport
);

reportRouter.get('/sent', auth, reportController.getMyReports);

module.exports = reportRouter;
