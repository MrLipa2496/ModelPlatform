const db = require('../models');
const { Op } = require('sequelize');
const ServerError = require('../errors/ServerError');
const fs = require('fs').promises;
const path = require('path');

const getAgencyProfile = async userId => {
  const agency = await db.Agency.findOne({ where: { USR_ID: userId } });
  if (!agency) {
    throw new ServerError('Agency profile not found for this user', 404);
  }
  return agency;
};

const checkCastingOwnership = async (castingId, agencyId) => {
  const casting = await db.Casting.findByPk(castingId);
  if (!casting) {
    throw new ServerError('Casting not found', 404);
  }
  if (casting.AGN_ID !== agencyId) {
    throw new ServerError('Forbidden: You do not own this casting', 403);
  }
  return casting;
};

const deleteCoverImage = async coverImagePath => {
  if (!coverImagePath) return;
  try {
    const fullPath = path.resolve(
      __dirname,
      '..',
      '..',
      'public',
      coverImagePath.substring(1)
    );
    await fs.unlink(fullPath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Failed to delete old cover image:', err);
    }
  }
};

module.exports = {
  createCasting: async (req, res, next) => {
    try {
      if (req.user.role !== 'agency') {
        throw new ServerError(
          'Forbidden: Only agencies can create castings',
          403
        );
      }

      const agency = await getAgencyProfile(req.user.id);

      if (!agency.AGN_Verified || agency.AGN_Status !== 'active') {
        throw new ServerError(
          'Forbidden: Only active and verified agencies can create castings',
          403
        );
      }

      const {
        CST_Title,
        CST_Description,
        CST_Requirements,
        CST_Payment,
        CST_StartDate,
        CST_EndDate,
        CST_Type,
        CST_Gender,
        CST_AgeMin,
        CST_AgeMax,
        CST_HeightMin,
        CST_HeightMax,
        CST_LocationType,
        CST_Country,
        CST_City,
      } = req.body;

      const coverImagePath = req.file ? `/uploads/${req.file.filename}` : null;

      const newCasting = await db.Casting.create({
        AGN_ID: agency.AGN_ID,
        CST_Title,
        CST_Description,
        CST_Requirements,
        CST_Payment,
        CST_StartDate,
        CST_EndDate,
        CST_Status: 'pending',
        CST_CoverImage: coverImagePath,
        CST_Type,
        CST_Gender,
        CST_AgeMin,
        CST_AgeMax,
        CST_HeightMin,
        CST_HeightMax,
        CST_LocationType,
        CST_Country,
        CST_City,
      });

      res.status(201).json(newCasting);
    } catch (err) {
      next(err);
    }
  },

  getAllCastings: async (req, res, next) => {
    try {
      const castings = await db.Casting.findAll({
        where: {
          CST_Status: {
            [Op.in]: ['active', 'approved'],
          },
        },
        include: [
          {
            model: db.Agency,
            as: 'Agency',
            attributes: ['AGN_ID', 'AGN_Name', 'AGN_Logo'],
          },
        ],
        order: [['CST_StartDate', 'DESC']],
      });
      res.status(200).json(castings);
    } catch (err) {
      next(err);
    }
  },

  getCastingById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const casting = await db.Casting.findOne({
        where: {
          CST_ID: id,
          CST_Status: {
            [Op.in]: ['active', 'approved'],
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
        throw new ServerError('Casting not found or not active', 404);
      }

      res.status(200).json(casting);
    } catch (err) {
      next(err);
    }
  },

  updateCasting: async (req, res, next) => {
    try {
      if (req.user.role !== 'agency') {
        throw new ServerError(
          'Forbidden: Only agencies can update castings',
          403
        );
      }

      const { id } = req.params;
      const agency = await getAgencyProfile(req.user.id);

      const casting = await checkCastingOwnership(id, agency.AGN_ID);

      const { CST_Status, ...updateData } = req.body;

      if (req.file) {
        await deleteCoverImage(casting.CST_CoverImage);
        updateData.CST_CoverImage = `/uploads/${req.file.filename}`;
      }

      updateData.CST_Status = 'pending';

      const [updatedRows] = await db.Casting.update(updateData, {
        where: { CST_ID: id },
      });

      if (updatedRows === 0) {
        throw new ServerError('Casting not found or data is unchanged', 404);
      }

      const updatedCasting = await db.Casting.findByPk(id);
      res.status(200).json(updatedCasting);
    } catch (err) {
      next(err);
    }
  },

  deleteCasting: async (req, res, next) => {
    try {
      if (req.user.role !== 'agency') {
        throw new ServerError(
          'Forbidden: Only agencies can delete castings',
          403
        );
      }

      const { id } = req.params;
      const agency = await getAgencyProfile(req.user.id);

      const casting = await checkCastingOwnership(id, agency.AGN_ID);

      await deleteCoverImage(casting.CST_CoverImage);

      await casting.destroy();

      res.status(200).json({ message: 'Casting deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  getMyCastings: async (req, res, next) => {
    try {
      if (req.user.role !== 'agency') {
        throw new ServerError('Forbidden', 403);
      }

      const agency = await getAgencyProfile(req.user.id);

      const castings = await db.Casting.findAll({
        where: { AGN_ID: agency.AGN_ID },
        include: [
          {
            model: db.Application,
            as: 'Applications',
            attributes: ['APP_ID'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json(castings);
    } catch (err) {
      next(err);
    }
  },
};
