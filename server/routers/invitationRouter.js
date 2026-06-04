const { Router } = require('express');
const invitationController = require('../controllers/invitationController');
const auth = require('../middlewares/authMiddleware');

const invitationRouter = Router();

invitationRouter.post('/', auth, invitationController.createInvitation);

invitationRouter.get('/sent', auth, invitationController.getMySentInvitations);

invitationRouter.get('/my', auth, invitationController.getMyInvitations);

invitationRouter.patch(
  '/:id/respond',
  auth,
  invitationController.respondToInvitation
);

module.exports = invitationRouter;
