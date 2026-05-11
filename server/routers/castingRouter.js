const { Router } = require('express');
const castingController = require('../controllers/castingController');
const auth = require('../middlewares/authMiddleware');
const { uploadCastingCover } = require('../middlewares/upload');
const jwt = require('jsonwebtoken');

const castingRouter = Router();

const { AUTH } = require('../utils/constants');

const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      req.user = jwt.verify(token, AUTH.SECRET_KEY);
    }
  } catch (e) {}
  next();
};

castingRouter.get('/', castingController.getAllCastings);

castingRouter.get('/:id', optionalAuth, castingController.getCastingById);

castingRouter.post(
  '/',
  auth,
  uploadCastingCover,
  castingController.createCasting
);

castingRouter.put(
  '/:id',
  auth,
  uploadCastingCover,
  castingController.updateCasting
);

castingRouter.delete('/:id', auth, castingController.deleteCasting);

castingRouter.get('/my/agencies', auth, castingController.getMyCastings);

module.exports = castingRouter;
