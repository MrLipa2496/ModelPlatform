const { Router } = require('express');
const modelController = require('../controllers/modelController');
const auth = require('../middlewares/authMiddleware');
const optionalAuth = require('../middlewares/optionalAuthMiddleware');
const { uploadProfilePhoto } = require('../middlewares/upload');

const modelRouter = Router();

modelRouter.get('/models', modelController.getModels);
modelRouter.get('/model/:id', optionalAuth, modelController.getModel);

modelRouter.get('/profile', auth, modelController.getProfile);
modelRouter.put('/profile', auth, modelController.updateProfile);
modelRouter.patch(
  '/profile/photo',
  auth,
  uploadProfilePhoto,
  modelController.updatePhoto
);

module.exports = modelRouter;
