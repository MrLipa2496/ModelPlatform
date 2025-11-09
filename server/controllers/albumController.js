const fs = require('fs').promises;
const path = require('path');
const { Op } = require('sequelize');
const db = require('../models');
const ServerError = require('../errors/ServerError');

const deletePhotoFiles = async photos => {
  const unlinkPromises = photos.map(photo => {
    if (photo.PH_Url) {
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'public',
        photo.PH_Url.substring(1)
      );
      return fs.unlink(filePath).catch(err => {
        console.error(`Failed to delete file: ${filePath}`, err);
      });
    }
    return Promise.resolve();
  });
  await Promise.all(unlinkPromises);
};

const checkModelOwnership = async (modelId, userId) => {
  const model = await db.Model.findByPk(modelId, { attributes: ['USR_ID'] });
  if (!model) {
    throw new ServerError('Model not found', 404);
  }
  if (model.USR_ID !== userId) {
    throw new ServerError('Forbidden: You do not own this model profile', 403);
  }
  return model;
};

const checkAlbumOwnership = async (albumId, userId) => {
  const album = await db.Album.findByPk(albumId, {
    include: {
      model: db.Model,
      as: 'Model',
      attributes: ['USR_ID'],
    },
  });

  if (!album) {
    throw new ServerError('Album not found', 404);
  }
  if (album.Model.USR_ID !== userId) {
    throw new ServerError('Forbidden: You do not own this album', 403);
  }
  return album;
};

exports.createAlbum = async (req, res, next) => {
  try {
    const { modelId } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === '') {
      throw new ServerError('Album title is required', 400);
    }

    await checkModelOwnership(modelId, userId);

    const albumCount = await db.Album.count({
      where: { ALB_ModelID: modelId },
    });
    if (albumCount >= 3) {
      throw new ServerError('Maximum of 3 albums allowed', 400);
    }

    const album = await db.Album.create({
      ALB_ModelID: modelId,
      ALB_Title: title,
      ALB_Description: description,
    });

    res.status(201).json({ message: 'Album created successfully', album });
  } catch (err) {
    next(err);
  }
};

exports.uploadPhotos = async (req, res, next) => {
  const files = req.files;
  let orphanedFiles = [];
  if (files && files.length > 0) {
    orphanedFiles = files.map(file => ({
      PH_Url: `/uploads/${path.basename(file.path)}`,
    }));
  }

  try {
    const { albumId } = req.params;
    const userId = req.user.id;

    if (!files || files.length === 0) {
      throw new ServerError('No files were uploaded', 400);
    }

    const album = await db.Album.findByPk(albumId, {
      include: [
        { model: db.Model, as: 'Model', attributes: ['USR_ID'] },
        { model: db.Photo, as: 'Photos', attributes: ['PH_ID'] },
      ],
    });

    if (!album) throw new ServerError('Album not found', 404);
    if (album.Model.USR_ID !== userId) throw new ServerError('Forbidden', 403);

    if (album.Photos.length + files.length > 10) {
      await deletePhotoFiles(orphanedFiles);
      throw new ServerError('Maximum of 10 photos per album', 400);
    }

    const photoRecords = files.map(file => ({
      PH_AlbumID: albumId,
      PH_Url: `/uploads/${path.basename(file.path)}`,
      PH_Title: file.originalname,
    }));

    const uploadedPhotos = await db.Photo.bulkCreate(photoRecords);

    res.status(201).json({
      message: 'Photos uploaded successfully',
      photos: uploadedPhotos,
    });
  } catch (err) {
    await deletePhotoFiles(orphanedFiles);
    next(err);
  }
};

exports.getModelAlbums = async (req, res, next) => {
  try {
    const { modelId } = req.params;

    const albums = await db.Album.findAll({
      where: { ALB_ModelID: modelId },
      include: [{ model: db.Photo, as: 'Photos' }],
      order: [['ALB_ID', 'ASC']],
    });

    res.json(albums);
  } catch (err) {
    next(err);
  }
};

exports.deleteAlbum = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const { albumId } = req.params;
    const userId = req.user.id;

    await checkAlbumOwnership(albumId, userId);

    const photos = await db.Photo.findAll({
      where: { PH_AlbumID: albumId },
      transaction: t,
    });

    if (photos.length > 0) {
      await deletePhotoFiles(photos);
      await db.Photo.destroy({
        where: { PH_AlbumID: albumId },
        transaction: t,
      });
    }

    await db.Album.destroy({ where: { ALB_ID: albumId }, transaction: t });

    await t.commit();
    res.json({ message: 'Album deleted successfully' });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.updateAlbumDetails = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === '') {
      throw new ServerError('Album title is required', 400);
    }

    const album = await checkAlbumOwnership(albumId, userId);

    album.ALB_Title = title;
    album.ALB_Description = description;
    await album.save();

    res.json(album);
  } catch (err) {
    next(err);
  }
};

exports.deletePhotos = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const { albumId } = req.params;
    const { photoIds } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      throw new ServerError('photoIds must be a non-empty array', 400);
    }

    await checkAlbumOwnership(albumId, userId);

    const photosToDelete = await db.Photo.findAll({
      where: {
        PH_AlbumID: albumId,
        PH_ID: { [Op.in]: photoIds },
      },
      transaction: t,
    });

    let deletedCount = 0;
    if (photosToDelete.length > 0) {
      await deletePhotoFiles(photosToDelete);

      deletedCount = await db.Photo.destroy({
        where: {
          PH_ID: { [Op.in]: photosToDelete.map(p => p.PH_ID) },
        },
        transaction: t,
      });
    }

    await t.commit();
    res.json({ message: `${deletedCount} photos deleted` });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
