const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ServerError = require('../errors/ServerError');
const { UPLOAD_CONFIG } = require('../utils/constants');

const uploadDir = path.join(__dirname, '../../public', UPLOAD_CONFIG.DIR);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, uploadDir);
  },
  filename (req, file, cb) {
    const sanitizedName = file.originalname
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uniqueName = `${Date.now()}-${sanitizedName}`;
    cb(null, uniqueName);
  },
});

const imageFilter = (req, file, cb) => {
  if (UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ServerError('Only image files are allowed! (jpeg, png, webp)', 400),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE },
});

module.exports = {
  uploadProfilePhoto: upload.single('photo'),
  uploadAlbumPhotos: upload.array('photos', 10),
  uploadCastingCover: upload.single('coverImage'),
  uploadAgencyLogo: upload.single('logo'),
};
