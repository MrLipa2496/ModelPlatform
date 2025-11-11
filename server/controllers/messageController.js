const db = require('../models');
const { Op } = require('sequelize');
const ServerError = require('../errors/ServerError');

module.exports = {
  sendMessage: async (req, res, next) => {
    try {
      const { MSG_ReceiverID, MSG_Content } = req.body;
      const senderId = req.user.id;

      if (!MSG_ReceiverID || !MSG_Content) {
        throw new ServerError(
          'Receiver ID and message content are required',
          400
        );
      }

      if (senderId === parseInt(MSG_ReceiverID, 10)) {
        throw new ServerError('You cannot send a message to yourself', 400);
      }

      const receiver = await db.User.findByPk(MSG_ReceiverID);
      if (!receiver) {
        throw new ServerError('Receiver user not found', 404);
      }

      const newMessage = await db.Message.create({
        MSG_SenderID: senderId,
        MSG_ReceiverID: MSG_ReceiverID,
        MSG_Content: MSG_Content,
      });

      res.status(201).json(newMessage);
    } catch (err) {
      next(err);
    }
  },
  getConversations: async (req, res, next) => {
    try {
      const myUserId = req.user.id;

      const allMessages = await db.Message.findAll({
        where: {
          [Op.or]: [{ MSG_SenderID: myUserId }, { MSG_ReceiverID: myUserId }],
        },
        include: [
          {
            model: db.User,
            as: 'Sender',
            attributes: ['USR_ID', 'USR_Role'],
            include: [
              {
                model: db.Model,
                attributes: ['MOD_FirstName', 'MOD_LastName', 'MOD_Photo'],
              },
              { model: db.Agency, attributes: ['AGN_Name', 'AGN_Logo'] },
            ],
          },
          {
            model: db.User,
            as: 'Receiver',
            attributes: ['USR_ID', 'USR_Role'],
            include: [
              {
                model: db.Model,
                attributes: ['MOD_FirstName', 'MOD_LastName', 'MOD_Photo'],
              },
              { model: db.Agency, attributes: ['AGN_Name', 'AGN_Logo'] },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      const conversationsMap = new Map();
      for (const msg of allMessages) {
        const otherUser =
          msg.MSG_SenderID === myUserId ? msg.Receiver : msg.Sender;

        if (!conversationsMap.has(otherUser.USR_ID)) {
          conversationsMap.set(otherUser.USR_ID, {
            withUser: otherUser,
            lastMessage: msg,
          });
        }
      }

      const conversationList = Array.from(conversationsMap.values());

      res.status(200).json(conversationList);
    } catch (err) {
      next(err);
    }
  },
  getMessagesWithUser: async (req, res, next) => {
    try {
      const myUserId = req.user.id;
      const otherUserId = parseInt(req.params.userId, 10);

      if (isNaN(otherUserId)) {
        throw new ServerError('Invalid User ID in URL parameter', 400);
      }

      const messages = await db.Message.findAll({
        where: {
          [Op.or]: [
            {
              MSG_SenderID: myUserId,
              MSG_ReceiverID: otherUserId,
            },
            {
              MSG_SenderID: otherUserId,
              MSG_ReceiverID: myUserId,
            },
          ],
        },
        order: [['createdAt', 'ASC']], // Історію чату показуємо у хронологічному порядку
      });

      res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
  },
};
