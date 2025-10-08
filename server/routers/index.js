const { Router } = require('express');
const authRouter = require('./authRouters');
const modelRouter = require('./modelRouters');

const router = Router();

router.use('/auth', authRouter);
router.use('/model', modelRouter);

module.exports = router;
