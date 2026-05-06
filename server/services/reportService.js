const db = require('../models');
const { UPLOAD_CONFIG } = require('../utils/constants');

class ReportService {
  async createReport (userId, body, file) {
    const { type, subject, message, reportedUserId } = body;

    if (reportedUserId) {
      const userExists = await db.User.findByPk(reportedUserId);
      if (!userExists) {
        throw new Error('User you are reporting does not exist.');
      }
    }

    let attachmentPath = null;
    if (file) {
      attachmentPath = `/${UPLOAD_CONFIG.DIR}/${file.filename}`;
    }

    return await db.Report.create({
      USR_ID: userId,
      RPT_Type: type || 'other',
      RPT_Subject: subject,
      RPT_Message: message,
      RPT_ReportedUserID: reportedUserId || null,
      RPT_Attachment: attachmentPath,
      RPT_Status: 'pending',
    });
  }

  async getMyReports (userId) {
    return await db.Report.findAll({
      where: { USR_ID: userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.User,
          as: 'ReportedUser',
          attributes: ['USR_ID', 'USR_Email', 'USR_Role'],
        },
      ],
    });
  }
}

module.exports = new ReportService();
