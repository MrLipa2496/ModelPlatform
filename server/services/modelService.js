const db = require('../models');
const fs = require('fs').promises;
const path = require('path');
const { PATHS } = require('../utils/constants');

class ModelService {
  async getMyProfile (userId) {
    const model = await db.Model.findOne({
      where: { USR_ID: userId },
      include: [
        { model: db.User, as: 'User', attributes: ['USR_Email', 'USR_Role'] },
      ],
    });

    if (!model) throw new Error('Profile not found');

    const modelData = model.toJSON();

    if (modelData.MOD_Status === 'blocked') {
      const lastAction = await db.AdminAction.findOne({
        where: { ACT_TargetID: userId },
        order: [['createdAt', 'DESC']],
      });

      modelData.MOD_RejectionReason =
        lastAction?.ACT_Details?.reason ||
        'No specific reason provided. Please contact support.';
    }

    return modelData;
  }

  async updateProfile (userId, updateData) {
    const model = await this._getModelByUserId(userId);

    await model.update(updateData);

    return model;
  }

  async updatePhoto (userId, filename) {
    const model = await this._getModelByUserId(userId);

    await this._deletePhysicalFile(model.MOD_Photo);

    const newPhotoPath = `${PATHS.UPLOADS}${filename}`;

    await model.update({ MOD_Photo: newPhotoPath });

    return {
      message: 'Photo updated successfully',
      photoUrl: newPhotoPath,
    };
  }

  async getAllPublicModels (page = 1, limit = 12) {
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Model.findAndCountAll({
      where: {
        MOD_Verified: true,
      },
      attributes: [
        'MOD_ID',
        'MOD_FirstName',
        'MOD_LastName',
        'MOD_Photo',
        'MOD_Experience',
        'MOD_Gender',
        'MOD_BirthDate',
        'MOD_Height',
      ],
      limit: limit,
      offset: offset,
      order: [['MOD_ID', 'DESC']],
    });

    return {
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async getPublicModelById (modelId, isAdmin = false) {
    const whereClause = { MOD_ID: modelId };

    if (!isAdmin) {
      whereClause.MOD_Verified = true;
    }
    const model = await db.Model.findOne({
      where: whereClause,
      attributes: [
        'MOD_ID',
        'MOD_FirstName',
        'MOD_LastName',
        'MOD_Gender',
        'MOD_BirthDate',
        'MOD_Height',
        'MOD_Weight',
        'MOD_EyeColor',
        'MOD_HairColor',
        'MOD_Experience',
        'MOD_Skills',
        'MOD_Bio',
        'MOD_Photo',
        'MOD_Status',
        'MOD_Verified',
      ],
      include: [
        {
          model: db.User,
          as: 'User',
          attributes: ['USR_Role', 'USR_Email'],
        },
      ],
    });

    if (!model) throw new Error('Model not found');
    return model;
  }

  async _getModelByUserId (userId) {
    const model = await db.Model.findOne({ where: { USR_ID: userId } });
    if (!model) throw new Error('Profile not found');
    return model;
  }

  async _deletePhysicalFile (filePath) {
    if (!filePath) return;
    try {
      const fullPath = path.resolve(
        __dirname,
        '../../public',
        filePath.startsWith('/') ? filePath.substring(1) : filePath
      );

      await fs.unlink(fullPath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('Failed to delete old photo:', err);
      }
    }
  }
}

module.exports = new ModelService();
