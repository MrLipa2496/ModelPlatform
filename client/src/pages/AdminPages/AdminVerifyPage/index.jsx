import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiEye,
  FiBriefcase,
  FiCheckSquare,
} from 'react-icons/fi';
import {
  fetchAdminUsers,
  changeAdminUserStatus,
} from '../../../store/slices/adminSlice';
import CONSTANTS from '../../../utils/constants';
import {
  ADMIN_APPROVE_VALIDATION,
  ADMIN_REJECT_VALIDATION,
} from '../../../utils/validationSchema';
import ModalWindow from '../../../components/ModalWindow';
import styles from './AdminVerifyPage.module.sass';

export default function AdminVerifyPage () {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.admin);

  const [activeTab, setActiveTab] = useState('model');
  const [approvingUserId, setApprovingUserId] = useState(null);
  const [rejectingUserId, setRejectingUserId] = useState(null);

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

  const handleApproveSubmit = async () => {
    if (approvingUserId) {
      try {
        await dispatch(
          changeAdminUserStatus({
            id: approvingUserId,
            data: { status: 'active', reason: 'Passed KYC verification' },
          })
        ).unwrap();

        setApprovingUserId(null);

        dispatch(
          fetchAdminUsers({
            role: activeTab,
            status: 'pending',
            page: 1,
            limit: CONSTANTS.PAGINATION_LIMIT,
          })
        );
      } catch (error) {
        console.error('Failed to approve user:', error);
      }
    }
  };

  const handleRejectSubmit = async values => {
    if (rejectingUserId) {
      try {
        await dispatch(
          changeAdminUserStatus({
            id: rejectingUserId,
            data: {
              status: 'blocked',
              reason: values.reason || 'Failed KYC verification',
            },
          })
        ).unwrap();

        setRejectingUserId(null);

        dispatch(
          fetchAdminUsers({
            role: activeTab,
            status: 'pending',
            page: 1,
            limit: CONSTANTS.PAGINATION_LIMIT,
          })
        );
      } catch (error) {
        console.error('Failed to reject user:', error);
      }
    }
  };

  const renderUserRow = user => {
    const isModel = activeTab === 'model';

    const name = isModel
      ? `${user.MOD_FirstName || ''} ${user.MOD_LastName || ''}`.trim()
      : user.AGN_Name;

    const locationArray = isModel
      ? [user.MOD_City, user.MOD_Country]
      : [user.AGN_City, user.AGN_Country];

    const location = locationArray.filter(Boolean).join(', ');
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
              <p className={styles.primaryText}>{name || 'Unknown User'}</p>
              <p className={styles.secondaryText}>{email}</p>
            </div>
          </div>
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
            <Link
              to={profileLink}
              rel='noopener noreferrer'
              className={styles.viewBtn}
              title='View Profile in new tab'
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                color: '#333',
                textDecoration: 'none',
                background: '#fff',
                marginRight: '8px',
              }}
            >
              <FiEye />
            </Link>

            <button
              className={styles.approveBtn}
              onClick={() => setApprovingUserId(user.USR_ID)}
              title='Approve User'
            >
              <FiCheck /> Approve
            </button>
            <button
              className={styles.rejectBtn}
              onClick={() => setRejectingUserId(user.USR_ID)}
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
          <p className={styles.description}>
            Review and process new account registrations. Approved users will
            gain full platform access.
          </p>
        </div>
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

      {approvingUserId && (
        <ModalWindow
          title='Approve User'
          submitLabel='Confirm Approval'
          model={{}}
          fields={[]}
          validationSchema={ADMIN_APPROVE_VALIDATION}
          onClose={() => setApprovingUserId(null)}
          onSubmit={handleApproveSubmit}
        />
      )}

      {rejectingUserId && (
        <ModalWindow
          title='Reject User'
          submitLabel='Reject & Block'
          model={{ reason: '' }}
          fields={[
            {
              name: 'reason',
              label: 'Reason for rejection',
              type: 'textarea',
              placeholder:
                'Please detail why this profile is being rejected...',
              quickOptions: CONSTANTS.REJECTION_REASONS,
            },
          ]}
          validationSchema={ADMIN_REJECT_VALIDATION}
          onClose={() => setRejectingUserId(null)}
          onSubmit={handleRejectSubmit}
        />
      )}
    </div>
  );
}
