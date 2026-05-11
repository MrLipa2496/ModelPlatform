const messageService = require('../services/messageService');
const ServerError = require('../errors/ServerError');

module.exports = {
  sendMessage: async (req, res, next) => {
    try {
      const { MSG_ReceiverID, MSG_Content } = req.body;

      if (!MSG_ReceiverID || !MSG_Content) {
        return next(
          new ServerError('Receiver ID and message content are required', 400)
        );
      }

      const newMessage = await messageService.sendMessage(
        req.user.id,
        MSG_ReceiverID,
        MSG_Content
      );

      res.status(201).json(newMessage);
    } catch (err) {
      if (err.message.includes('not found'))
        return next(new ServerError(err.message, 404));
      if (err.message.includes('yourself'))
        return next(new ServerError(err.message, 400));
      next(err);
    }
  },

  getConversations: async (req, res, next) => {
    try {
      const conversations = await messageService.getUserConversations(
        req.user.id
      );
      res.status(200).json(conversations);
    } catch (err) {
      next(err);
    }
  },

  getMessagesWithUser: async (req, res, next) => {
    try {
      const otherUserId = parseInt(req.params.userId, 10);

      if (isNaN(otherUserId)) {
        return next(new ServerError('Invalid User ID', 400));
      }

      const messages = await messageService.getChatHistory(
        req.user.id,
        otherUserId
      );

      res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
  },
};
