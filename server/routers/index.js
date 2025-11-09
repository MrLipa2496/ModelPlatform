const { Router } = require('express');
const authRouter = require('./authRouters');
const modelRouter = require('./modelRouters');
const agencyRoutes = require('./agencyRouters');
const albumRoutes = require('./albumRoutes');

const router = Router();

router.use('/auth', authRouter);
router.use('/model', modelRouter);
router.use('/agency', agencyRoutes);
router.use('/albums', albumRoutes);

module.exports = router;
