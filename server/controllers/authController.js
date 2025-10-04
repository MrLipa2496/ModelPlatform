const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Model, Agency } = require('../models');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';
const TOKEN_EXPIRES_IN = '7d';

const generateAccessToken = user => {
  return jwt.sign({ id: user.USR_ID, role: user.USR_Role }, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRES_IN,
  });
};

exports.signupModel = async (req, res) => {
  try {
    const { email, password, firstName, lastName, gender, birthDate } =
      req.body;

    const existingUser = await User.findOne({ where: { USR_Email: email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      USR_Email: email,
      USR_PasswordHash: passwordHash,
      USR_Role: 'model',
    });

    await Model.create({
      USR_ID: newUser.USR_ID,
      MOD_FirstName: firstName,
      MOD_LastName: lastName,
      MOD_Gender: gender,
      MOD_BirthDate: birthDate,
    });

    const token = generateAccessToken(newUser);
    newUser.USR_AccessToken = token;
    await newUser.save();

    res.status(201).json({
      accessToken: token,
      userId: newUser.USR_ID,
      role: newUser.USR_Role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signupAgency = async (req, res) => {
  try {
    const { email, password, agencyName, phone, location } = req.body;

    const existingUser = await User.findOne({ where: { USR_Email: email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      USR_Email: email,
      USR_PasswordHash: passwordHash,
      USR_Role: 'agency',
    });

    await Agency.create({
      USR_ID: newUser.USR_ID,
      AGN_Name: agencyName,
      AGN_Phone: phone,
      AGN_Location: location,
    });

    const token = generateAccessToken(newUser);
    newUser.USR_AccessToken = token;
    await newUser.save();

    res.status(201).json({
      accessToken: token,
      userId: newUser.USR_ID,
      role: newUser.USR_Role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { USR_Email: email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.USR_PasswordHash);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateAccessToken(user);
    user.USR_AccessToken = token;
    await user.save();

    res.json({ accessToken: token, userId: user.USR_ID, role: user.USR_Role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'No token provided' });

    const user = await User.findOne({ where: { USR_AccessToken: token } });
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.USR_AccessToken = null;
    await user.save();

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
