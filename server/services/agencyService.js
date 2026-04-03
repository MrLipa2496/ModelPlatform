const db = require('../models');
const fs = require('fs').promises;
const path = require('path');
const { STATUS, PATHS } = require('../utils/constants');

class AgencyService {
  async getAllPublicAgencies (page = 1, limit = 12) {
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Agency.findAndCountAll({
      attributes: [
        'AGN_ID',
        'AGN_Name',
        'AGN_Logo',
        'AGN_Description',
        'AGN_Phone',
        'AGN_Website',
        'AGN_Country',
        'AGN_City',
        'AGN_Verified',
        'AGN_Status',
      ],
      where: {
        AGN_Status: STATUS.ACTIVE,
        AGN_Verified: true,
      },
      order: [['AGN_ID', 'DESC']],

      limit: limit,
      offset: offset,

      raw: true,
    });
    return {
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async getAgencyWithCastings (id, isAdmin = false) {
    const whereClause = { AGN_ID: id };

    if (!isAdmin) {
      whereClause.AGN_Status = STATUS.ACTIVE;
    }

    const agency = await db.Agency.findOne({
      where: whereClause,
      attributes: [
        'AGN_ID',
        'AGN_Name',
        'AGN_Logo',
        'AGN_Description',
        'AGN_Phone',
        'AGN_Website',
        'AGN_Country',
        'AGN_City',
        'AGN_Verified',
        'AGN_Status',
      ],
      include: [
        {
          model: db.Casting,
          as: 'Castings',
          where: { CST_Status: STATUS.ACTIVE },
          attributes: ['CST_ID', 'CST_Title', 'CST_CoverImage', 'CST_City'],
          required: false,
        },
      ],
    });

    if (!agency) {
      throw new Error('Agency not found');
    }

    return agency;
  }

  async getMyAgencyProfile (userId) {
    const agency = await db.Agency.findOne({
      where: { USR_ID: userId },
      include: [
        {
          model: db.User,
          as: 'User',
          attributes: ['USR_Email'],
        },
      ],
    });

    if (!agency) {
      throw new Error('Agency profile not found');
    }

    const agencyData = agency.toJSON();

    if (agencyData.AGN_Status === 'blocked') {
      const lastAction = await db.AdminAction.findOne({
        where: { ACT_TargetID: userId },
        order: [['createdAt', 'DESC']],
      });

      agencyData.AGN_RejectionReason =
        lastAction?.ACT_Details?.reason ||
        'No specific reason provided. Please contact support.';
    }

    return agencyData;
  }

  async updateAgencyProfile (userId, updateData) {
    const agency = await db.Agency.findOne({
      where: { USR_ID: userId },
    });

    if (!agency) {
      throw new Error('Agency profile not found');
    }

    await agency.update(updateData);

    return agency;
  }

  async updateAgencyLogo (userId, filename) {
    const agency = await db.Agency.findOne({
      where: { USR_ID: userId },
    });

    if (!agency) {
      throw new Error('Agency profile not found');
    }

    await this._deleteOldLogo(agency.AGN_Logo);

    const newLogoPath = `${PATHS.LOGOS}${filename}`;

    await agency.update({ AGN_Logo: newLogoPath });

    return {
      message: 'Logo updated successfully',
      AGN_Logo: newLogoPath,
    };
  }

  async _deleteOldLogo (logoPath) {
    if (!logoPath) return;
    try {
      const fullPath = path.resolve(
        __dirname,
        '../../public',
        logoPath.startsWith('/') ? logoPath.substring(1) : logoPath
      );

      await fs.unlink(fullPath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('Failed to delete old logo file:', err);
      }
    }
  }
}

module.exports = new AgencyService();
