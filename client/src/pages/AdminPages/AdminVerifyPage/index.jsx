import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiBriefcase,
  FiCheckSquare,
} from 'react-icons/fi';
import {
  fetchAdminUsers,
  changeAdminUserStatus,
} from '../../../store/slices/adminSlice';
import CONSTANTS from '../../../utils/constants';
import styles from './AdminVerifyPage.module.sass';

export default function AdminVerifyPage () {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.admin);

  const [activeTab, setActiveTab] = useState('model');

  useEffect(() => {
    dispatch(
      fetchAdminUsers({
        role: activeTab,
        status: 'pending',
        page: 1,
        limit: CONSTANTS.PAGINATION_LIMIT,
      })
    );
  }, [dispatch, activeTab]);

  const handleApprove = userId => {
    if (window.confirm('Are you sure you want to approve this account?')) {
      dispatch(
        changeAdminUserStatus({
          id: userId,
          data: { status: 'active', reason: 'Passed KYC verification' },
        })
      );
    }
  };

  const handleReject = userId => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason !== null) {
      dispatch(
        changeAdminUserStatus({
          id: userId,
          data: {
            status: 'blocked',
            reason: reason || 'Failed KYC verification',
          },
        })
      );
    }
  };

  const renderUserRow = user => {
    const isModel = activeTab === 'model';

    const name = isModel
      ? `${user.MOD_FirstName} ${user.MOD_LastName}`
      : user.AGN_Name;

    const location = isModel
      ? user.MOD_City
      : `${user.AGN_City || ''}, ${user.AGN_Country || ''}`;

    const email = user.User?.USR_Email || 'No email provided';
    const date = new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const profileLink = isModel
      ? `/model/${user.MOD_ID}`
      : `/agency/${user.AGN_ID}`;
    const avatarImg = isModel ? user.MOD_Photo : user.AGN_Logo;

    return (
      <tr key={user.USR_ID} className={styles.tableRow}>
        <td className={styles.cellName}>
          <Link
            to={profileLink}
            className={styles.profileLink}
            target='_blank'
            rel='noopener noreferrer'
            title='View Full Profile'
          >
            <div className={styles.nameWrapper}>
              <div className={styles.avatarPlaceholder}>
                {avatarImg ? (
                  <img
                    src={`${CONSTANTS.BASE_URL}${avatarImg}`}
                    alt={name}
                    className={styles.avatarImage}
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerText = name
                        .charAt(0)
                        .toUpperCase();
                    }}
                  />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className={styles.primaryText}>{name}</p>
                <p className={styles.secondaryText}>{email}</p>
              </div>
            </div>
          </Link>
        </td>
        <td className={styles.cellLocation}>
          <p className={styles.primaryText}>{location || 'Not specified'}</p>
        </td>
        <td className={styles.cellDate}>
          <div className={styles.dateWrapper}>
            <FiClock className={styles.iconSmall} />
            <span>{date}</span>
          </div>
        </td>
        <td className={styles.cellActions}>
          <div className={styles.actionButtons}>
            <button
              className={styles.approveBtn}
              onClick={() => handleApprove(user.USR_ID)}
              title='Approve User'
            >
              <FiCheck /> Approve
            </button>
            <button
              className={styles.rejectBtn}
              onClick={() => handleReject(user.USR_ID)}
              title='Reject User'
            >
              <FiX /> Reject
            </button>
          </div>
        </td>
      </tr>
    );
  };
  const pendingUsers = users.filter(u => {
    const status = activeTab === 'model' ? u.MOD_Status : u.AGN_Status;
    return status === 'pending';
  });

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTitles}>
          <p className={styles.subtitle}>MODERATION</p>
          <h1 className={styles.title}>Verification Center</h1>
        </div>
        <p className={styles.description}>
          Review and process new account registrations. Approved users will gain
          full platform access.
        </p>
      </header>

      <div className={styles.content}>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabBtn} ${
              activeTab === 'model' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('model')}
          >
            <FiUser className={styles.tabIcon} /> Models
          </button>
          <button
            className={`${styles.tabBtn} ${
              activeTab === 'agency' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('agency')}
          >
            <FiBriefcase className={styles.tabIcon} /> Agencies
          </button>
        </div>

        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              Loading pending applications...
            </div>
          ) : pendingUsers.length > 0 ? (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Location</th>
                  <th>Applied On</th>
                  <th className={styles.alignRight}>Actions</th>
                </tr>
              </thead>
              <tbody>{pendingUsers.map(renderUserRow)}</tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrapper}>
                <FiCheckSquare className={styles.emptyIcon} />
              </div>
              <h3>All caught up!</h3>
              <p>
                There are no pending {activeTab} registrations at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
