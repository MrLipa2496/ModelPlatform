const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');
const { uploadProfilePhoto } = require('../middlewares/upload');
const auth = require('../middlewares/authMiddleware');
const optionalAuth = require('../middlewares/optionalAuthMiddleware');

router.get('/agencies', agencyController.getAgencies);
router.get('/agency/:id', optionalAuth, agencyController.getAgency);

router.get('/profile', auth, agencyController.getProfile);

router.put('/profile', auth, agencyController.updateProfile);

router.patch(
  '/profile/logo',
  auth,
  uploadProfilePhoto,
  agencyController.updateLogo
);

module.exports = router;
