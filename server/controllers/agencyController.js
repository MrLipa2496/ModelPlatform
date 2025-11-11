const db = require('../models');
const ServerError = require('../errors/ServerError');
const fs = require('fs').promises;
const path = require('path');
const { Op } = require('sequelize');

const getAgencyProfileByUserId = async userId => {
  const agency = await db.Agency.findOne({ where: { USR_ID: userId } });
  if (!agency) {
    throw new ServerError('Agency profile not found for this user', 404);
  }
  return agency;
};

const deleteLogoFile = async logoPath => {
  if (!logoPath) return;
  try {
    const fullPath = path.resolve(
      __dirname,
      '..',
      '..',
      'public',
      logoPath.substring(1)
    );
    await fs.unlink(fullPath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Failed to delete old logo file:', err);
    }
  }
};

exports.getAgencies = async (req, res, next) => {
  try {
    const agencies = await db.Agency.findAll({
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
        AGN_Status: 'active',
        AGN_Verified: true,
      },
      order: [['AGN_ID', 'DESC']],
    });
    res.json(agencies);
  } catch (err) {
    next(err);
  }
};

exports.getAgency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agency = await db.Agency.findOne({
      where: {
        AGN_ID: id,
        AGN_Status: 'active',
      },
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
      ],
      include: [
        {
          model: db.Casting,
          as: 'Castings',
          where: {
            CST_Status: 'active',
          },
          attributes: ['CST_ID', 'CST_Title', 'CST_CoverImage', 'CST_City'],
          required: false,
        },
      ],
    });

    if (!agency) {
      return next(new ServerError('Agency not found', 404));
    }
    res.json(agency);
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'agency') {
      return next(new ServerError('Forbidden', 403));
    }

    const agency = await db.Agency.findOne({
      where: { USR_ID: req.user.id },
      include: [
        {
          model: db.User,
          as: 'User',
          attributes: ['USR_Email'],
        },
      ],
    });

    if (!agency) {
      return next(new ServerError('Agency profile not found', 404));
    }
    res.json(agency);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'agency') {
      return next(new ServerError('Forbidden', 403));
    }

    const agency = await getAgencyProfileByUserId(req.user.id);

    const {
      AGN_Name,
      AGN_Description,
      AGN_Phone,
      AGN_Website,
      AGN_Country,
      AGN_City,
    } = req.body;

    const [updatedRows] = await db.Agency.update(
      {
        AGN_Name,
        AGN_Description,
        AGN_Phone,
        AGN_Website,
        AGN_Country,
        AGN_City,
      },
      {
        where: { AGN_ID: agency.AGN_ID },
      }
    );

    if (updatedRows === 0) {
      return next(new ServerError('Data is unchanged', 304));
    }

    const updatedAgency = await db.Agency.findByPk(agency.AGN_ID);
    res.json(updatedAgency);
  } catch (err) {
    next(err);
  }
};

exports.updateLogo = async (req, res, next) => {
  try {
    if (req.user.role !== 'agency') {
      return next(new ServerError('Forbidden', 403));
    }
    if (!req.file) {
      return next(new ServerError('No logo file uploaded', 400));
    }

    const agency = await getAgencyProfileByUserId(req.user.id);

    await deleteLogoFile(agency.AGN_Logo);

    const newLogoPath = `/uploads/logos/${req.file.filename}`;
    await agency.update({ AGN_Logo: newLogoPath });

    res.json({
      message: 'Logo updated successfully',
      AGN_Logo: newLogoPath,
    });
  } catch (err) {
    next(err);
  }
};
