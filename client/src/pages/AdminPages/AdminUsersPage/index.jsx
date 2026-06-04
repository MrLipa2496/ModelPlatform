import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import {
  FiUser,
  FiBriefcase,
  FiSearch,
  FiLock,
  FiUnlock,
  FiEye,
  FiFilter,
} from 'react-icons/fi';
import {
  fetchAdminUsers,
  changeAdminUserStatus,
} from '../../../store/slices/adminSlice';
import CONSTANTS from '../../../utils/constants';
import ModalWindow from '../../../components/ModalWindow';
import Pagination from '../../../components/Pagination';
import { ADMIN_REJECT_VALIDATION } from '../../../utils/validationSchema';
import styles from './AdminUsersPage.module.sass';

export default function AdminUsersPage () {
  const dispatch = useDispatch();
  const { users, loading, usersTotalPages, usersCurrentPage } = useSelector(
    state => state.admin
  );

  const [activeTab, setActiveTab] = useState('model');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [blockingUserId, setBlockingUserId] = useState(null);
  const [unblockingUserId, setUnblockingUserId] = useState(null);

  useEffect(() => {
    dispatch(
      fetchAdminUsers({
        role: activeTab,
        page: 1,
        limit: CONSTANTS.PAGINATION_LIMIT,
      })
    );
  }, [dispatch, activeTab]);

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= usersTotalPages) {
      dispatch(
        fetchAdminUsers({
          role: activeTab,
          page: newPage,
          limit: CONSTANTS.PAGINATION_LIMIT,
        })
      );
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const isModel = activeTab === 'model';
      const status = isModel ? user.MOD_Status : user.AGN_Status;
      const name = isModel
        ? `${user.MOD_FirstName} ${user.MOD_LastName}`.toLowerCase()
        : (user.AGN_Name || '').toLowerCase();
      const email = (user.User?.USR_Email || '').toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      if (statusFilter !== 'all' && status !== statusFilter) return false;

      if (
        searchQuery &&
        !name.includes(searchLower) &&
        !email.includes(searchLower)
      )
        return false;

      return true;
    });
  }, [users, activeTab, statusFilter, searchQuery]);

  const handleBlockSubmit = async values => {
    if (blockingUserId) {
      try {
        await dispatch(
          changeAdminUserStatus({
            id: blockingUserId,
            data: {
              status: 'blocked',
              reason: values.reason,
            },
          })
        ).unwrap();

        setBlockingUserId(null);

        dispatch(
          fetchAdminUsers({
            role: activeTab,
            page: 1,
            limit: 100,
          })
        );
      } catch (error) {
        console.error('Failed to block user:', error);
      }
    }
  };

  const handleUnblockSubmit = async () => {
    if (unblockingUserId) {
      try {
        await dispatch(
          changeAdminUserStatus({
            id: unblockingUserId,
            data: { status: 'active', reason: 'Unblocked by administrator' },
          })
        ).unwrap();

        setUnblockingUserId(null);

        dispatch(
          fetchAdminUsers({
            role: activeTab,
            page: 1,
            limit: 100,
          })
        );
      } catch (error) {
        console.error('Failed to unblock user:', error);
      }
    }
  };

  const renderUserRow = user => {
    const isModel = activeTab === 'model';

    const name = isModel
      ? `${user.MOD_FirstName || ''} ${user.MOD_LastName || ''}`.trim() ||
        'Unknown Model'
      : user.AGN_Name || 'Unknown Agency';

    const email = user.User?.USR_Email || 'No email';
    const status = isModel ? user.MOD_Status : user.AGN_Status;
    const profileLink = isModel
      ? `/model/${user.MOD_ID}`
      : `/agency/${user.AGN_ID}`;
    const avatarImg = isModel ? user.MOD_Photo : user.AGN_Logo;

    return (
      <tr key={user.USR_ID} className={styles.tableRow}>
        <td className={styles.cellName}>
          <div className={styles.nameWrapper}>
            <div
              className={styles.avatarPlaceholder}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ position: 'absolute' }}>
                {name.charAt(0).toUpperCase()}
              </span>

              {avatarImg && (
                <img
                  src={`${CONSTANTS.BASE_URL}${avatarImg}`}
                  alt={name}
                  className={styles.avatarImage}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: '#fff',
                  }}
                  onError={e => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>
            <div>
              <p className={styles.primaryText}>{name}</p>
              <p className={styles.secondaryText}>{email}</p>
            </div>
          </div>
        </td>
        <td>
          <span className={`${styles.statusBadge} ${styles[status]}`}>
            {status}
          </span>
        </td>
        <td>
          <p className={styles.secondaryText}>
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </td>
        <td className={styles.cellActions}>
          <div className={styles.actionButtons}>
            <Link
              to={profileLink}
              className={`${styles.actionBtn} ${styles.viewBtn}`}
            >
              <FiEye /> View
            </Link>

            {status !== 'blocked' ? (
              <button
                className={`${styles.actionBtn} ${styles.blockBtn}`}
                onClick={() => setBlockingUserId(user.USR_ID)}
              >
                <FiLock /> Block
              </button>
            ) : (
              <button
                className={`${styles.actionBtn} ${styles.unblockBtn}`}
                onClick={() => setUnblockingUserId(user.USR_ID)}
              >
                <FiUnlock /> Unblock
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <p className={styles.subtitle}>SYSTEM</p>
        <h1 className={styles.title}>User Management</h1>
        <p className={styles.description}>
          Search, filter, and manage all registered models and agencies on the
          platform.
        </p>
      </header>

      <div className={styles.controlsWrapper}>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabBtn} ${
              activeTab === 'model' ? styles.activeTab : ''
            }`}
            onClick={() => {
              setActiveTab('model');
              setStatusFilter('all');
            }}
          >
            <FiUser /> Models
          </button>
          <button
            className={`${styles.tabBtn} ${
              activeTab === 'agency' ? styles.activeTab : ''
            }`}
            onClick={() => {
              setActiveTab('agency');
              setStatusFilter('all');
            }}
          >
            <FiBriefcase /> Agencies
          </button>
        </div>

        <div className={styles.filtersWrapper}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type='text'
              placeholder='Search by name or email...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className={styles.statusSelect}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value='all'>All Statuses</option>
            <option value='active'>Active</option>
            <option value='pending'>Pending</option>
            <option value='blocked'>Blocked</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.emptyState}>Loading users...</div>
        ) : filteredUsers.length > 0 ? (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th className={styles.alignRight}>Actions</th>
              </tr>
            </thead>
            <tbody>{filteredUsers.map(renderUserRow)}</tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <FiFilter className={styles.emptyIcon} />
            <h3>No users found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {usersTotalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={usersCurrentPage}
            totalPages={usersTotalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {blockingUserId && (
        <ModalWindow
          title='Block User'
          submitLabel='Block Account'
          model={{ reason: '' }}
          fields={[
            {
              name: 'reason',
              label: 'Reason for blocking',
              type: 'textarea',
              placeholder: 'Explain why this user is being blocked...',
              quickOptions: CONSTANTS.REJECTION_REASONS,
            },
          ]}
          validationSchema={ADMIN_REJECT_VALIDATION}
          onClose={() => setBlockingUserId(null)}
          onSubmit={handleBlockSubmit}
        />
      )}

      {unblockingUserId && (
        <ModalWindow
          title='Unblock User'
          submitLabel='Restore Access'
          model={{}}
          fields={[]}
          validationSchema={Yup.object()}
          onClose={() => setUnblockingUserId(null)}
          onSubmit={handleUnblockSubmit}
        />
      )}
    </div>
  );
}
