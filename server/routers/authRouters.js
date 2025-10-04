const { Router } = require('express');
const authController = require('../controllers/authController');

const authRouter = Router();

authRouter.post('/signup/model', authController.signupModel);
authRouter.post('/signup/agency', authController.signupAgency);

authRouter.post('/login', authController.login);
authRouter.get('/logout', authController.logout);

module.exports = authRouter;
