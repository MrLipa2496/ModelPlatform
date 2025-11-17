const { Router } = require('express');
const applicationController = require('../controllers/applicationController');
const auth = require('../middlewares/authMiddleware');

const applicationRouter = Router();

applicationRouter.post('/', auth, applicationController.createApplication);
applicationRouter.get(
  '/applications',
  auth,
  applicationController.getMyApplications
);

applicationRouter.get(
  '/agency',
  auth,
  applicationController.getAgencyApplications
);
applicationRouter.get(
  '/casting/:id',
  auth,
  applicationController.getApplicationsForCasting
);
applicationRouter.patch(
  '/:id/respond',
  auth,
  applicationController.respondToApplication
);

module.exports = applicationRouter;
