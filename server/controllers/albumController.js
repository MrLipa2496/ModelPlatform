const albumService = require('../services/albumService');
const ServerError = require('../errors/ServerError');

exports.createAlbum = async (req, res, next) => {
  try {
    const { modelId } = req.params;
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return next(new ServerError('Album title is required', 400));
    }

    const album = await albumService.createAlbum(req.user.id, modelId, {
      title,
      description,
    });

    res.status(201).json({ message: 'Album created successfully', album });
  } catch (err) {
    if (err.message.includes('Maximum of')) {
      return next(new ServerError(err.message, 400));
    }
    if (err.message.includes('Forbidden')) {
      return next(new ServerError(err.message, 403));
    }
    if (err.message === 'Model not found') {
      return next(new ServerError(err.message, 404));
    }
    next(err);
  }
};

exports.getModelAlbums = async (req, res, next) => {
  try {
    const albums = await albumService.getModelAlbums(req.params.modelId);
    res.json(albums);
  } catch (err) {
    next(err);
  }
};

exports.updateAlbumDetails = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return next(new ServerError('Album title is required', 400));
    }

    const updatedAlbum = await albumService.updateAlbum(
      req.user.id,
      req.params.albumId,
      {
        title,
        description,
      }
    );

    res.json(updatedAlbum);
  } catch (err) {
    if (err.message.includes('Forbidden'))
      return next(new ServerError(err.message, 403));
    if (err.message === 'Album not found')
      return next(new ServerError(err.message, 404));
    next(err);
  }
};

exports.deleteAlbum = async (req, res, next) => {
  try {
    const result = await albumService.deleteAlbum(
      req.user.id,
      req.params.albumId
    );
    res.json(result);
  } catch (err) {
    if (err.message.includes('Forbidden'))
      return next(new ServerError(err.message, 403));
    if (err.message === 'Album not found')
      return next(new ServerError(err.message, 404));
    next(err);
  }
};

exports.uploadPhotos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new ServerError('No files were uploaded', 400));
    }

    const result = await albumService.uploadPhotos(
      req.user.id,
      req.params.albumId,
      req.files
    );

    res.status(201).json(result);
  } catch (err) {
    if (err.message.includes('Maximum of'))
      return next(new ServerError(err.message, 400));
    if (err.message.includes('Forbidden'))
      return next(new ServerError(err.message, 403));
    if (err.message === 'Album not found')
      return next(new ServerError(err.message, 404));
    next(err);
  }
};

exports.deletePhotos = async (req, res, next) => {
  try {
    const { photoIds } = req.body;

    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return next(new ServerError('photoIds must be a non-empty array', 400));
    }

    const result = await albumService.deletePhotosFromAlbum(
      req.user.id,
      req.params.albumId,
      photoIds
    );

    res.json({ message: `${result.count} photos deleted` });
  } catch (err) {
    if (err.message.includes('Forbidden'))
      return next(new ServerError(err.message, 403));
    if (err.message === 'Album not found')
      return next(new ServerError(err.message, 404));
    next(err);
  }
};
