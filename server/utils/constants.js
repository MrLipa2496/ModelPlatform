module.exports = {
  ROLES: {
    MODEL: 'model',
    AGENCY: 'agency',
  },
  HTTP_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
    FORBIDDEN: 403,
  },
  LIMITS: {
    MAX_ALBUMS_PER_MODEL: 3,
    MAX_PHOTOS_PER_ALBUM: 10,
  },
  MESSAGES: {
    EMAIL_IN_USE: 'Email already in use',
    INVALID_CREDS: 'Invalid credentials',
    NO_TOKEN: 'No token provided',
    INVALID_TOKEN: 'Invalid token',
    LOGGED_OUT: 'Logged out successfully',
    SERVER_ERROR: 'Server error',
  },
  AUTH: {
    SALT_ROUNDS: 10,
    TOKEN_EXPIRES_IN: '3h',
    SECRET_KEY: process.env.JWT_SECRET || 'supersecretkey',
  },
  UPLOAD_CONFIG: {
    MAX_FILE_SIZE: 15 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    DIR: 'uploads',
  },
  STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    ACCEPTED: 'accepted',
    APPROVED: 'approved',
    BLOCKED: 'blocked',
    REJECTED: 'rejected',
    CLOSED: 'closed',
  },
  PDF_SETTINGS: {
    BASE_URL: process.env.API_URL || 'http://localhost:5001',
  },
  PATHS: {
    UPLOADS: '/uploads/',
    LOGOS: '/uploads/logos/',
  },
};
