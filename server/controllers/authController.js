const authService = require('../services/authService');
const { HTTP_CODES, ROLES, MESSAGES } = require('../utils/constants');

const handleError = (res, err) => {
  console.error(err);
  const isKnownError = Object.values(MESSAGES).includes(err.message);
  const status = isKnownError
    ? HTTP_CODES.BAD_REQUEST
    : HTTP_CODES.SERVER_ERROR;
  const message = isKnownError ? err.message : MESSAGES.SERVER_ERROR;

  res.status(status).json({ message });
};

exports.signupModel = async (req, res) => {
  try {
    const { email, password, ...profileData } = req.body;

    const result = await authService.registerUser({
      email,
      password,
      role: ROLES.MODEL,
      profileData,
    });

    res.status(HTTP_CODES.CREATED).json(result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.signupAgency = async (req, res) => {
  try {
    const { email, password, ...profileData } = req.body;

    const result = await authService.registerUser({
      email,
      password,
      role: ROLES.AGENCY,
      profileData,
    });

    res.status(HTTP_CODES.CREATED).json(result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization;
    await authService.logoutUser(token);
    res.json({ message: MESSAGES.LOGGED_OUT });
  } catch (err) {
    handleError(res, err);
  }
};
