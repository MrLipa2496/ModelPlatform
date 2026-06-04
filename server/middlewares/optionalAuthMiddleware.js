const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AUTH } = require('../utils/constants');

const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, AUTH.SECRET_KEY);
    const user = await User.findOne({ where: { USR_ID: decoded.id } });

    if (user && user.USR_AccessToken === token) {
      req.user = {
        id: user.USR_ID,
        role: user.USR_Role,
        email: user.USR_Email,
      };
    }
    next();
  } catch (err) {
    next();
  }
};

module.exports = optionalAuthMiddleware;
