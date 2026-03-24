const db = require('../models');
const { Op } = require('sequelize');

class MessageService {
  async sendMessage (senderId, receiverId, content) {
    if (senderId === parseInt(receiverId, 10)) {
      throw new Error('You cannot send a message to yourself');
    }

    const receiver = await db.User.findByPk(receiverId);
    if (!receiver) {
      throw new Error('Receiver user not found');
    }

    return await db.Message.create({
      MSG_SenderID: senderId,
      MSG_ReceiverID: receiverId,
      MSG_Content: content,
    });
  }

  async getUserConversations (userId) {
    const allMessages = await db.Message.findAll({
      where: {
        [Op.or]: [{ MSG_SenderID: userId }, { MSG_ReceiverID: userId }],
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
      const otherUser = msg.MSG_SenderID === userId ? msg.Receiver : msg.Sender;

      if (!conversationsMap.has(otherUser.USR_ID)) {
        conversationsMap.set(otherUser.USR_ID, {
          withUser: otherUser,
          lastMessage: {
            content: msg.MSG_Content,
            createdAt: msg.createdAt,
            isRead: msg.MSG_IsRead,
          },
        });
      }
    }

    return Array.from(conversationsMap.values());
  }

  async getChatHistory (currentUserId, otherUserId) {
    return await db.Message.findAll({
      where: {
        [Op.or]: [
          { MSG_SenderID: currentUserId, MSG_ReceiverID: otherUserId },
          { MSG_SenderID: otherUserId, MSG_ReceiverID: currentUserId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });
  }
}

module.exports = new MessageService();
