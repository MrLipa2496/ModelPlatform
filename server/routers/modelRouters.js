const { Router } = require('express');
const modelController = require('../controllers/modelController');
const auth = require('../middleware/auth');
const upload = require('../middlewares/upload');

const modelRouter = Router();

modelRouter.get('/profile', auth, modelController.getProfile);
modelRouter.put('/profile', auth, modelController.updateProfile);
modelRouter.patch(
  '/profile/photo',
  auth,
  upload.single('photo'),
  modelController.updatePhoto
);

module.exports = modelRouter;
