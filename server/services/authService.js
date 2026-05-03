const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { ROLES, MESSAGES, AUTH } = require('../utils/constants');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

const generateAccessToken = user => {
  return jwt.sign({ id: user.USR_ID, role: user.USR_Role }, SECRET_KEY, {
    expiresIn: AUTH.TOKEN_EXPIRES_IN,
  });
};

class AuthService {
  async registerUser ({ email, password, role, profileData }) {
    const transaction = await db.sequelize.transaction();

    try {
      const existingUser = await db.User.findOne({
        where: { USR_Email: email },
        transaction,
      });

      if (existingUser) {
        throw new Error(MESSAGES.EMAIL_IN_USE);
      }

      const passwordHash = await bcrypt.hash(password, AUTH.SALT_ROUNDS);

      const newUser = await db.User.create(
        {
          USR_Email: email,
          USR_PasswordHash: passwordHash,
          USR_Role: role,
        },
        { transaction }
      );

      if (role === ROLES.MODEL) {
        await db.Model.create(
          {
            USR_ID: newUser.USR_ID,
            MOD_FirstName: profileData.firstName,
            MOD_LastName: profileData.lastName,
            MOD_Gender: profileData.gender,
            MOD_BirthDate: profileData.birthDate,
            MOD_Country: profileData.country,
            MOD_City: profileData.city,
          },
          { transaction }
        );
      } else if (role === ROLES.AGENCY) {
        await db.Agency.create(
          {
            USR_ID: newUser.USR_ID,
            AGN_Name: profileData.agencyName,
            AGN_Phone: profileData.phone,
            AGN_Country: profileData.country,
            AGN_City: profileData.city,
          },
          { transaction }
        );
      }

      const token = generateAccessToken(newUser);
      newUser.USR_AccessToken = token;
      await newUser.save({ transaction });

      await transaction.commit();

      return {
        accessToken: token,
        userId: newUser.USR_ID,
        role: newUser.USR_Role,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async loginUser (email, password) {
    const user = await db.User.findOne({ where: { USR_Email: email } });
    if (!user) throw new Error(MESSAGES.INVALID_CREDS);

    const isMatch = await bcrypt.compare(password, user.USR_PasswordHash);
    if (!isMatch) throw new Error(MESSAGES.INVALID_CREDS);

    const token = generateAccessToken(user);
    user.USR_AccessToken = token;
    await user.save();

    return { accessToken: token, userId: user.USR_ID, role: user.USR_Role };
  }

  async logoutUser (token) {
    if (!token) throw new Error(MESSAGES.NO_TOKEN);

    const cleanToken = token.startsWith('Bearer ')
      ? token.split(' ')[1]
      : token;

    const user = await db.User.findOne({
      where: { USR_AccessToken: cleanToken },
    });
    if (!user) throw new Error(MESSAGES.INVALID_TOKEN);

    user.USR_AccessToken = null;
    await user.save();
    return true;
  }
}

module.exports = new AuthService();
