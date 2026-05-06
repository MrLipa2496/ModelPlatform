const db = require('../models');

class AdminService {
  async getUsers ({ role, status, page = 1, limit = 12 }) {
    const offset = (page - 1) * limit;
    let count, rows;

    if (role === 'model') {
      const whereClause = {};
      if (status) whereClause.MOD_Status = status;

      const result = await db.Model.findAndCountAll({
        where: whereClause,
        include: [
          { model: db.User, as: 'User', attributes: ['USR_Email', 'USR_Role'] },
        ],
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        order: [['createdAt', 'DESC']],
      });
      count = result.count;
      rows = result.rows;
    } else if (role === 'agency') {
      const whereClause = {};
      if (status) whereClause.AGN_Status = status;

      const result = await db.Agency.findAndCountAll({
        where: whereClause,
        include: [
          { model: db.User, as: 'User', attributes: ['USR_Email', 'USR_Role'] },
        ],
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        order: [['createdAt', 'DESC']],
      });
      count = result.count;
      rows = result.rows;
    } else {
      throw new Error('Invalid role specified');
    }

    return {
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    };
  }

  async changeUserStatus (adminId, targetUserId, newStatus, reason = '') {
    const user = await db.User.findByPk(targetUserId);
    if (!user) throw new Error('User not found');

    let targetType = '';
    const isVerified = newStatus === 'active';

    if (user.USR_Role === 'model') {
      const model = await db.Model.findOne({ where: { USR_ID: targetUserId } });
      if (!model) throw new Error('Profile not found');

      await model.update({ MOD_Status: newStatus, MOD_Verified: isVerified });
      targetType = 'Model';
    } else if (user.USR_Role === 'agency') {
      const agency = await db.Agency.findOne({
        where: { USR_ID: targetUserId },
      });
      if (!agency) throw new Error('Profile not found');

      await agency.update({ AGN_Status: newStatus, AGN_Verified: isVerified });
      targetType = 'Agency';
    }

    await db.AdminAction.create({
      USR_ID: adminId,
      ACT_Type: `UPDATE_STATUS_${newStatus.toUpperCase()}`,
      ACT_TargetType: targetType,
      ACT_TargetID: targetUserId,
      ACT_Details: { reason, previousRole: user.USR_Role },
    });

    return {
      message: `${targetType} status updated to ${newStatus} successfully`,
      userId: targetUserId,
      status: newStatus,
    };
  }

  async getCastings (query) {
    const { page = 1, limit = 12, status = 'all', search = '' } = query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (status && status !== 'all') {
      whereClause.CST_Status = status;
    }

    if (search) {
      whereClause.CST_Title = { [db.Sequelize.Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await db.Casting.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Agency,
          as: 'Agency',
          attributes: ['AGN_ID', 'AGN_Name', 'AGN_Logo'],
        },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    };
  }

  async changeCastingStatus (adminId, castingId, newStatus, reason = '') {
    const casting = await db.Casting.findByPk(castingId);

    if (!casting) {
      throw new Error('Casting not found');
    }

    const previousStatus = casting.CST_Status;
    await casting.update({ CST_Status: newStatus });

    await db.AdminAction.create({
      USR_ID: adminId,
      ACT_Type: `UPDATE_CASTING_${newStatus.toUpperCase()}`,
      ACT_TargetType: 'Casting',
      ACT_TargetID: castingId,
      ACT_Details: {
        reason: reason || 'Violation of platform rules',
        previousStatus,
      },
    });

    return {
      message: `Casting status updated to ${newStatus} successfully`,
      castingId,
      status: newStatus,
    };
  }

  async getDashboardStats () {
    const totalModels = await db.Model.count();
    const totalAgencies = await db.Agency.count();

    const activeCastings = await db.Casting.count({
      where: { CST_Status: 'active' },
    });
    const pendingModelsCount = await db.Model.count({
      where: { MOD_Status: 'pending' },
    });
    const pendingAgenciesCount = await db.Agency.count({
      where: { AGN_Status: 'pending' },
    });
    const pendingUsers = pendingModelsCount + pendingAgenciesCount;

    const recentPending = await db.Model.findAll({
      where: { MOD_Status: 'pending' },
      attributes: ['MOD_ID', 'MOD_FirstName', 'MOD_LastName', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 3,
    });

    const recentUsers = await db.Model.findAll({
      attributes: ['MOD_ID', 'MOD_FirstName', 'MOD_LastName', 'MOD_Status'],
      order: [['createdAt', 'DESC']],
      limit: 3,
    });

    const recentCastings = await db.Casting.findAll({
      attributes: ['CST_ID', 'CST_Title', 'CST_Status'],
      order: [['createdAt', 'DESC']],
      limit: 3,
    });

    return {
      stats: {
        totalModels,
        totalAgencies,
        activeCastings,
        pendingUsers,
      },
      recent: {
        pending: recentPending,
        users: recentUsers,
        castings: recentCastings,
      },
    };
  }

  async getPlatformStatistics () {
    const [
      modelsCount,
      agenciesCount,
      modelsByStatus,
      agenciesByStatus,
      modelsByGender,
      castingsByStatus,
      applicationsByStatus,
      invitationsByStatus,
      albumsCount,
      photosCount,
    ] = await Promise.all([
      db.Model.count(),
      db.Agency.count(),

      db.Model.findAll({
        attributes: [
          'MOD_Status',
          [db.sequelize.fn('COUNT', db.sequelize.col('MOD_Status')), 'count'],
        ],
        group: ['MOD_Status'],
        raw: true,
      }),
      db.Agency.findAll({
        attributes: [
          'AGN_Status',
          [db.sequelize.fn('COUNT', db.sequelize.col('AGN_Status')), 'count'],
        ],
        group: ['AGN_Status'],
        raw: true,
      }),
      db.Model.findAll({
        attributes: [
          'MOD_Gender',
          [db.sequelize.fn('COUNT', db.sequelize.col('MOD_Gender')), 'count'],
        ],
        group: ['MOD_Gender'],
        raw: true,
      }),
      db.Casting.findAll({
        attributes: [
          'CST_Status',
          [db.sequelize.fn('COUNT', db.sequelize.col('CST_Status')), 'count'],
        ],
        group: ['CST_Status'],
        raw: true,
      }),
      db.Application.findAll({
        attributes: [
          'APP_Status',
          [db.sequelize.fn('COUNT', db.sequelize.col('APP_Status')), 'count'],
        ],
        group: ['APP_Status'],
        raw: true,
      }),
      db.Invitation.findAll({
        attributes: [
          'INV_Status',
          [db.sequelize.fn('COUNT', db.sequelize.col('INV_Status')), 'count'],
        ],
        group: ['INV_Status'],
        raw: true,
      }),

      db.Album.count(),
      db.Photo.count(),
    ]);

    const formatCounts = (data, keyField) => {
      return data.reduce((acc, item) => {
        acc[item[keyField]] = parseInt(item.count, 10);
        return acc;
      }, {});
    };

    const parsedCastings = formatCounts(castingsByStatus, 'CST_Status');
    const parsedApps = formatCounts(applicationsByStatus, 'APP_Status');
    const parsedInvs = formatCounts(invitationsByStatus, 'INV_Status');

    const totalApplications = Object.values(parsedApps).reduce(
      (a, b) => a + b,
      0
    );
    const totalInvitations = Object.values(parsedInvs).reduce(
      (a, b) => a + b,
      0
    );

    return {
      kpi: {
        totalUsers: modelsCount + agenciesCount,
        totalModels: modelsCount,
        totalAgencies: agenciesCount,
        activeCastings: parsedCastings['active'] || 0,
        totalConnections: totalApplications + totalInvitations,
      },
      users: {
        modelsByStatus: formatCounts(modelsByStatus, 'MOD_Status'),
        agenciesByStatus: formatCounts(agenciesByStatus, 'AGN_Status'),
      },
      demographics: {
        genderRatio: formatCounts(modelsByGender, 'MOD_Gender'),
      },
      economy: {
        castingsByStatus: parsedCastings,
        applicationsByStatus: parsedApps,
        invitationsByStatus: parsedInvs,
      },
      content: {
        totalAlbums: albumsCount,
        totalPhotos: photosCount,
      },
    };
  }

  async getAllInvitations (page = 1, limit = 12, status = '') {
    const offset = (page - 1) * limit;
    const where = status ? { INV_Status: status } : {};

    const { count, rows } = await db.Invitation.findAndCountAll({
      where,
      include: [
        {
          model: db.Model,
          as: 'Model',
          attributes: ['MOD_ID', 'MOD_FirstName', 'MOD_LastName', 'MOD_Photo'],
        },
        {
          model: db.Agency,
          as: 'Agency',
          attributes: ['AGN_ID', 'AGN_Name', 'AGN_Logo'],
        },
        {
          model: db.Casting,
          as: 'Casting',
          attributes: ['CST_ID', 'CST_Title'],
        },
      ],
      limit,
      offset,
      order: [['INV_SentAt', 'DESC']],
    });

    return {
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async getAllReports (page = 1, limit = 12, status = '') {
    const offset = (page - 1) * limit;
    const where = status ? { RPT_Status: status } : {};

    const { count, rows } = await db.Report.findAndCountAll({
      where,
      include: [
        {
          model: db.User,
          as: 'Sender',
          attributes: ['USR_ID', 'USR_Email', 'USR_Role'], // Кто отправил
        },
        {
          model: db.User,
          as: 'ReportedUser',
          attributes: ['USR_ID', 'USR_Email', 'USR_Role'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async updateReportStatus (reportId, status, adminNotes) {
    const report = await db.Report.findByPk(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    if (status) report.RPT_Status = status;
    if (adminNotes !== undefined) report.RPT_AdminNotes = adminNotes;

    await report.save();
    return report;
  }
}

module.exports = new AdminService();
