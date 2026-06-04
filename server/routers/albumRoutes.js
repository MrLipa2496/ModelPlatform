const { Router } = require('express');
const albumController = require('../controllers/albumController');
const auth = require('../middlewares/authMiddleware');
const { uploadAlbumPhotos } = require('../middlewares/upload');

const albumRouter = Router();

albumRouter.get('/model/:modelId', auth, albumController.getModelAlbums);

albumRouter.post('/:modelId', auth, albumController.createAlbum);

albumRouter.post(
  '/:albumId/photos',
  auth,
  uploadAlbumPhotos,
  albumController.uploadPhotos
);

albumRouter.patch('/:albumId/photos', auth, albumController.deletePhotos);

albumRouter.put('/:albumId', auth, albumController.updateAlbumDetails);

albumRouter.delete('/:albumId', auth, albumController.deleteAlbum);

module.exports = albumRouter;
