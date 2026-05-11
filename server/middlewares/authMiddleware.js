const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AUTH, MESSAGES, HTTP_CODES } = require('../utils/constants');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(HTTP_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.NO_TOKEN });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, AUTH.SECRET_KEY);
    } catch (err) {
      return res
        .status(HTTP_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.INVALID_TOKEN });
    }

    const user = await User.findOne({ where: { USR_ID: decoded.id } });
    if (!user) {
      return res
        .status(HTTP_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.INVALID_TOKEN });
    }

    if (user.USR_AccessToken !== token) {
      return res
        .status(HTTP_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.INVALID_TOKEN });
    }

    req.user = {
      id: user.USR_ID,
      role: user.USR_Role,
      email: user.USR_Email,
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res
      .status(HTTP_CODES.SERVER_ERROR)
      .json({ message: MESSAGES.SERVER_ERROR });
  }
};

module.exports = authMiddleware;
