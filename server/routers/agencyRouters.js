const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');

router.get('/agencies', agencyController.getAgencies);
router.get('/agency/:id', agencyController.getAgency);

module.exports = router;
