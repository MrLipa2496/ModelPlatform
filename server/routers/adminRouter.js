const { Router } = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/authMiddleware');
const { HTTP_CODES } = require('../utils/constants');

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res
    .status(HTTP_CODES.FORBIDDEN || 403)
    .json({ message: 'Access denied. Admins only.' });
};

const adminRouter = Router();

adminRouter.use(auth, checkAdmin);

adminRouter.get('/users', adminController.getUsers);
adminRouter.patch('/users/:id/status', adminController.changeUserStatus);

adminRouter.get('/castings', adminController.getCastings);
adminRouter.patch('/castings/:id/status', adminController.moderateCasting);

adminRouter.get('/stats', adminController.getStats);

adminRouter.get('/statistics', adminController.getStatistics);

adminRouter.get('/invitations', adminController.getInvitations);

adminRouter.get('/reports', adminController.getReports);
adminRouter.patch('/reports/:id', adminController.updateReportStatus);

module.exports = adminRouter;
