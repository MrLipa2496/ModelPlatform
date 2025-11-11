const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ServerError = require('../errors/ServerError');

const env = process.env.NODE_ENV || 'development';

const baseUploadPath =
  env === 'production'
    ? '/var/www/html/uploads'
    : path.resolve(__dirname, '..', '..', 'public', 'uploads');

if (!fs.existsSync(baseUploadPath)) {
  fs.mkdirSync(baseUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, baseUploadPath);
  },
  filename (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ServerError('Тільки зображення дозволені!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

module.exports = {
  uploadProfilePhoto: upload.single('photo'),
  uploadAlbumPhotos: upload.array('photos', 10),
  uploadCastingCover: upload.single('coverImage'),
};
