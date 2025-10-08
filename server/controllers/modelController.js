const path = require('path');
const fs = require('fs');
const db = require('../models');
const ServerError = require('../errors/ServerError');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const model = await db.Model.findOne({
      where: { USR_ID: userId },
      include: [
        { model: db.User, as: 'User', attributes: ['USR_Email', 'USR_Role'] },
      ],
    });

    if (!model) return res.status(404).json({ message: 'Profile not found' });

    res.json(model);
  } catch (err) {
    console.error('Error in getProfile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const model = await db.Model.findOne({ where: { USR_ID: userId } });
    if (!model) return res.status(404).json({ message: 'Profile not found' });

    const {
      MOD_FirstName,
      MOD_LastName,
      MOD_Gender,
      MOD_BirthDate,
      MOD_Height,
      MOD_Weight,
      MOD_EyeColor,
      MOD_HairColor,
      MOD_Experience,
      MOD_Skills,
      MOD_Bio,
    } = req.body;

    await model.update({
      MOD_FirstName,
      MOD_LastName,
      MOD_Gender,
      MOD_BirthDate,
      MOD_Height,
      MOD_Weight,
      MOD_EyeColor,
      MOD_HairColor,
      MOD_Experience,
      MOD_Skills,
      MOD_Bio,
    });

    res.json({ message: 'Profile updated successfully', model });
  } catch (err) {
    console.error('Error in updateProfile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const model = await db.Model.findOne({ where: { USR_ID: userId } });
    if (!model) return res.status(404).json({ message: 'Profile not found' });

    if (!req.file) throw new ServerError('No file uploaded');

    const photoPath = `/uploads/${req.file.filename}`;

    if (model.MOD_Photo) {
      const oldPath = path.resolve(
        __dirname,
        '..',
        '..',
        'public',
        model.MOD_Photo
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await model.update({ MOD_Photo: photoPath });

    res.json({
      message: 'Photo updated successfully',
      photoUrl: photoPath,
    });
  } catch (err) {
    console.error('Error in updatePhoto:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
