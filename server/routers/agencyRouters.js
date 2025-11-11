const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');
const { uploadProfilePhoto } = require('../middlewares/upload');
const auth = require('../middlewares/authMiddleware');

router.get('/agencies', agencyController.getAgencies);
router.get('/agency/:id', agencyController.getAgency);

router.get('/profile', auth, agencyController.getProfile);

router.put('/profile', auth, agencyController.updateProfile);

router.patch(
  '/profile/logo',
  auth,
  uploadProfilePhoto,
  agencyController.updateLogo
);

module.exports = router;
