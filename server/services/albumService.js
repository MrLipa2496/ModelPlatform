const db = require('../models');
const fs = require('fs').promises;
const path = require('path');
const { Op } = require('sequelize');
const { LIMITS, PATHS } = require('../utils/constants');

class AlbumService {
  async createAlbum (userId, modelId, { title, description }) {
    await this._checkModelOwnership(modelId, userId);

    const albumCount = await db.Album.count({
      where: { ALB_ModelID: modelId },
    });

    if (albumCount >= LIMITS.MAX_ALBUMS_PER_MODEL) {
      throw new Error(
        `Maximum of ${LIMITS.MAX_ALBUMS_PER_MODEL} albums allowed`
      );
    }

    return await db.Album.create({
      ALB_ModelID: modelId,
      ALB_Title: title,
      ALB_Description: description,
    });
  }

  async getModelAlbums (modelId) {
    return await db.Album.findAll({
      where: { ALB_ModelID: modelId },
      include: [{ model: db.Photo, as: 'Photos' }],
      order: [['ALB_ID', 'ASC']],
    });
  }

  async updateAlbum (userId, albumId, { title, description }) {
    const album = await this._checkAlbumOwnership(albumId, userId);

    return await album.update({
      ALB_Title: title,
      ALB_Description: description,
    });
  }

  async deleteAlbum (userId, albumId) {
    const t = await db.sequelize.transaction();

    try {
      const album = await db.Album.findOne({
        where: { ALB_ID: albumId },
        include: [
          { model: db.Model, as: 'Model', attributes: ['USR_ID'] },
          { model: db.Photo, as: 'Photos' },
        ],
        transaction: t,
      });

      if (!album) throw new Error('Album not found');
      if (album.Model.USR_ID !== userId)
        throw new Error('Forbidden: You do not own this album');

      if (album.Photos.length > 0) {
        await db.Photo.destroy({
          where: { PH_AlbumID: albumId },
          transaction: t,
        });
      }

      await db.Album.destroy({
        where: { ALB_ID: albumId },
        transaction: t,
      });

      await t.commit();

      if (album.Photos.length > 0) {
        await this._deletePhysicalFiles(album.Photos);
      }

      return { message: 'Album deleted successfully' };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async uploadPhotos (userId, albumId, files) {
    const uploadedFiles = files.map(file => ({
      PH_Url: `${PATHS.UPLOADS}${path.basename(file.path)}`,
    }));

    try {
      const album = await db.Album.findByPk(albumId, {
        include: [
          { model: db.Model, as: 'Model', attributes: ['USR_ID'] },
          { model: db.Photo, as: 'Photos', attributes: ['PH_ID'] },
        ],
      });

      if (!album) throw new Error('Album not found');
      if (album.Model.USR_ID !== userId) throw new Error('Forbidden');

      if (album.Photos.length + files.length > LIMITS.MAX_PHOTOS_PER_ALBUM) {
        throw new Error(
          `Maximum of ${LIMITS.MAX_PHOTOS_PER_ALBUM} photos per album`
        );
      }

      const photoRecords = files.map(file => ({
        PH_AlbumID: albumId,
        PH_Url: `${PATHS.UPLOADS}${path.basename(file.path)}`,
        PH_Title: file.originalname,
      }));

      const newPhotos = await db.Photo.bulkCreate(photoRecords);

      return {
        message: 'Photos uploaded successfully',
        photos: newPhotos,
      };
    } catch (err) {
      await this._deletePhysicalFiles(uploadedFiles);
      throw err;
    }
  }

  async deletePhotosFromAlbum (userId, albumId, photoIds) {
    const t = await db.sequelize.transaction();

    try {
      await this._checkAlbumOwnership(albumId, userId);

      const photosToDelete = await db.Photo.findAll({
        where: {
          PH_AlbumID: albumId,
          PH_ID: { [Op.in]: photoIds },
        },
        transaction: t,
      });

      if (photosToDelete.length === 0) {
        await t.commit();
        return { count: 0 };
      }

      const count = await db.Photo.destroy({
        where: {
          PH_ID: { [Op.in]: photosToDelete.map(p => p.PH_ID) },
        },
        transaction: t,
      });

      await t.commit();

      await this._deletePhysicalFiles(photosToDelete);

      return { count };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async _checkModelOwnership (modelId, userId) {
    const model = await db.Model.findByPk(modelId, { attributes: ['USR_ID'] });
    if (!model) throw new Error('Model not found');
    if (model.USR_ID !== userId)
      throw new Error('Forbidden: You do not own this model profile');
    return model;
  }

  async _checkAlbumOwnership (albumId, userId) {
    const album = await db.Album.findByPk(albumId, {
      include: {
        model: db.Model,
        as: 'Model',
        attributes: ['USR_ID'],
      },
    });

    if (!album) throw new Error('Album not found');
    if (album.Model.USR_ID !== userId)
      throw new Error('Forbidden: You do not own this album');
    return album;
  }

  async _deletePhysicalFiles (photos) {
    const unlinkPromises = photos.map(photo => {
      if (!photo.PH_Url) return Promise.resolve();

      const filePath = path.resolve(
        __dirname,
        '../../public',
        photo.PH_Url.startsWith('/') ? photo.PH_Url.substring(1) : photo.PH_Url
      );

      return fs.unlink(filePath).catch(err => {
        console.error(
          `Warning: Failed to delete file ${filePath}:`,
          err.message
        );
      });
    });

    await Promise.all(unlinkPromises);
  }
}

module.exports = new AlbumService();
