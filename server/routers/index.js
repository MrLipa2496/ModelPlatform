const { Router } = require('express');
const authRouter = require('./authRouters');
const modelRouter = require('./modelRouters');
const agencyRoutes = require('./agencyRouters');
const albumRoutes = require('./albumRoutes');
const castingRouter = require('./castingRouter');
const invitationRouter = require('./invitationRouter');
const applicationRouter = require('./applicationRouter');
const messageRouter = require('./messageRouter');

const router = Router();

router.use('/auth', authRouter);
router.use('/model', modelRouter);
router.use('/agency', agencyRoutes);
router.use('/albums', albumRoutes);
router.use('/castings', castingRouter);
router.use('/invitations', invitationRouter);
router.use('/applications', applicationRouter);
router.use('/messages', messageRouter);

module.exports = router;
