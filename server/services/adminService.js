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
}

module.exports = new AdminService();
