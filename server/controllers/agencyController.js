const db = require('../models');

exports.getAgencies = async (req, res) => {
  try {
    const agencies = await db.Agency.findAll({
      attributes: [
        'AGN_ID',
        'AGN_Name',
        'AGN_Logo',
        'AGN_Description',
        'AGN_Phone',
        'AGN_Website',
        'AGN_Country',
        'AGN_Verified',
        'AGN_Status',
      ],
      order: [['AGN_ID', 'DESC']],
    });

    res.json(agencies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load agencies list' });
  }
};

exports.getAgency = async (req, res) => {
  try {
    const { id } = req.params;

    const agency = await db.Agency.findOne({
      where: { AGN_ID: id },
      attributes: [
        'AGN_ID',
        'AGN_Name',
        'AGN_Logo',
        'AGN_Description',
        'AGN_Phone',
        'AGN_Website',
        'AGN_Country',
        'AGN_Verified',
        'AGN_Status',
      ],
      include: [
        {
          model: db.User,
          as: 'User',
          attributes: ['USR_Email', 'USR_Role'],
        },
        {
          model: db.Casting,
          as: 'Castings',
          attributes: ['CST_ID', 'CST_Title', 'CST_Description'],
        },
      ],
    });

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    res.json(agency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load agency info' });
  }
};
