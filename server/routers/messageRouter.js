const { Router } = require('express');
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/authMiddleware');

const messageRouter = Router();

messageRouter.use(auth);

messageRouter.post('/', messageController.sendMessage);

messageRouter.get('/', messageController.getConversations);

messageRouter.get('/:userId', messageController.getMessagesWithUser);

module.exports = messageRouter;
