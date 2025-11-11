const { Router } = require('express');
const castingController = require('../controllers/castingController');
const auth = require('../middlewares/authMiddleware');
const { uploadCastingCover } = require('../middlewares/upload');

const castingRouter = Router();

castingRouter.get('/', castingController.getAllCastings);

castingRouter.get('/:id', castingController.getCastingById);

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
