const db = require('../models');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');
const { STATUS, PATHS } = require('../utils/constants');

class CastingService {
  async createCasting (userId, data, file) {
    const agency = await this._getAgencyProfile(userId);

    if (!agency.AGN_Verified || agency.AGN_Status !== STATUS.ACTIVE) {
      throw new Error(
        'Forbidden: Only active and verified agencies can create castings'
      );
    }

    const coverImagePath = file ? `${PATHS.UPLOADS}${file.filename}` : null;

    return await db.Casting.create({
      AGN_ID: agency.AGN_ID,
      ...data,
      CST_Status: STATUS.PENDING,
      CST_CoverImage: coverImagePath,
    });
  }

  async getAllPublicCastings (page = 1, limit = 12) {
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Casting.findAndCountAll({
      where: {
        CST_Status: {
          [Op.in]: [STATUS.ACTIVE, STATUS.APPROVED],
        },
      },
      include: [
        {
          model: db.Agency,
          as: 'Agency',
          attributes: ['AGN_ID', 'AGN_Name', 'AGN_Logo'],
        },
      ],
      limit,
      offset,
      order: [['CST_StartDate', 'DESC']],
    });

    return {
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async getPublicCastingById (id) {
    const casting = await db.Casting.findOne({
      where: {
        CST_ID: id,
        CST_Status: {
          [Op.in]: [STATUS.ACTIVE, STATUS.APPROVED],
        },
      },
      include: [
        {
          model: db.Agency,
          as: 'Agency',
          attributes: [
            'AGN_ID',
            'AGN_Name',
            'AGN_Logo',
            'AGN_Description',
            'AGN_Country',
            'AGN_City',
          ],
        },
      ],
    });

    if (!casting) {
      throw new Error('Casting not found or not active');
    }

    return casting;
  }

  async getMyCastings (userId, page = 1, limit = 12) {
    const agency = await this._getAgencyProfile(userId);
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Casting.findAndCountAll({
      where: { AGN_ID: agency.AGN_ID },
      include: [
        {
          model: db.Application,
          as: 'Applications',
          attributes: ['APP_ID'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async updateCasting (userId, castingId, updateData, file) {
    const agency = await this._getAgencyProfile(userId);

    const casting = await this._checkCastingOwnership(castingId, agency.AGN_ID);

    if (file) {
      await this._deletePhysicalFile(casting.CST_CoverImage);
      updateData.CST_CoverImage = `${PATHS.UPLOADS}${file.filename}`;
    }

    updateData.CST_Status = STATUS.PENDING;

    await casting.update(updateData);

    return casting;
  }

  async deleteCasting (userId, castingId) {
    const agency = await this._getAgencyProfile(userId);

    const casting = await this._checkCastingOwnership(castingId, agency.AGN_ID);

    await this._deletePhysicalFile(casting.CST_CoverImage);

    await casting.destroy();

    return true;
  }

  async _getAgencyProfile (userId) {
    const agency = await db.Agency.findOne({ where: { USR_ID: userId } });
    if (!agency) throw new Error('Agency profile not found for this user');
    return agency;
  }

  async _checkCastingOwnership (castingId, agencyId) {
    const casting = await db.Casting.findByPk(castingId);
    if (!casting) throw new Error('Casting not found');
    if (casting.AGN_ID !== agencyId)
      throw new Error('Forbidden: You do not own this casting');
    return casting;
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
        console.error('Failed to delete file:', err);
      }
    }
  }
}

module.exports = new CastingService();
