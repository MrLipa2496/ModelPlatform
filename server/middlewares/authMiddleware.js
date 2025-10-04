const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token)
      return res.status(401).json({ message: 'Malformed token header' });

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findOne({ where: { USR_ID: decoded.id } });
    if (!user) return res.status(401).json({ message: 'User not found' });

    if (user.USR_AccessToken !== token)
      return res.status(401).json({ message: 'Token is no longer valid' });

    req.user = {
      id: user.USR_ID,
      role: user.USR_Role,
      email: user.USR_Email,
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ message: 'Server error in auth middleware' });
  }
};

module.exports = authMiddleware;
