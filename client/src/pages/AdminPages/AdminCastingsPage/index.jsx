import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import {
  FiSearch,
  FiCheck,
  FiLock,
  FiUnlock,
  FiExternalLink,
} from 'react-icons/fi';
import {
  fetchAdminCastings,
  changeAdminCastingStatus,
  clearAdminCastingsList,
} from '../../../store/slices/adminSlice';
import ModalWindow from '../../../components/ModalWindow';
import styles from './AdminCastingsPage.module.sass';

export default function AdminCastingsPage () {
  const dispatch = useDispatch();
  const { castings, castingsTotalPages, castingsCurrentPage, loading } =
    useSelector(state => state.admin);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCasting, setSelectedCasting] = useState(null);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      fetchAdminCastings({
        status: statusFilter,
        page,
        limit: 10,
        search: debouncedSearch,
      })
    );
  }, [dispatch, statusFilter, page, debouncedSearch]);

  useEffect(() => {
    return () => {
      dispatch(clearAdminCastingsList());
    };
  }, [dispatch]);

  const openModal = (casting, newStatus) => {
    setSelectedCasting(casting);
    setActionType(newStatus);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCasting(null);
  };

  const renderStatusBadge = status => {
    switch (status) {
      case 'active':
        return (
          <span className={`${styles.badge} ${styles.badgeActive}`}>
            Active
          </span>
        );
      case 'pending':
        return (
          <span className={`${styles.badge} ${styles.badgePending}`}>
            Pending
          </span>
        );
      case 'blocked':
        return (
          <span className={`${styles.badge} ${styles.badgeBlocked}`}>
            Blocked
          </span>
        );
      default:
        return (
          <span className={`${styles.badge} ${styles.badgeClosed}`}>
            {status}
          </span>
        );
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <p className={styles.subtitle}>CONTENT MODERATION</p>
        <h1 className={styles.title}>Castings Management</h1>
        <p className={styles.description}>
          Monitor all platform casting calls. You can search, filter, and block
          castings that violate community guidelines.
        </p>
      </header>

      <div className={styles.controlsPanel}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type='text'
            placeholder='Search casting by title...'
            className={styles.searchInput}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value='all'>All Statuses</option>
          <option value='active'>Active</option>
          <option value='closed'>Closed</option>
          <option value='blocked'>Blocked</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Casting Title</th>
              <th>Agency</th>
              <th>Date Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && castings.length === 0 ? (
              <tr>
                <td colSpan='5' style={{ textAlign: 'center' }}>
                  Loading data...
                </td>
              </tr>
            ) : castings.length === 0 ? (
              <tr>
                <td colSpan='5' style={{ textAlign: 'center' }}>
                  No castings found.
                </td>
              </tr>
            ) : (
              castings.map(casting => (
                <tr key={casting.CST_ID}>
                  <td className={styles.castingTitle}>{casting.CST_Title}</td>
                  <td>
                    <div className={styles.agencyInfo}>
                      {casting.Agency?.AGN_Logo ? (
                        <img
                          src={`http://localhost:5001${casting.Agency.AGN_Logo}`}
                          alt='logo'
                          className={styles.agencyLogo}
                        />
                      ) : (
                        <div className={styles.agencyLogo} />
                      )}
                      {casting.Agency?.AGN_Name || 'Unknown Agency'}
                    </div>
                  </td>
                  <td>{new Date(casting.createdAt).toLocaleDateString()}</td>
                  <td>{renderStatusBadge(casting.CST_Status)}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        to={`/castings/${casting.CST_ID}`}
                        className={styles.actionBtn}
                        title='View Details'
                      >
                        <FiExternalLink />
                      </Link>

                      {casting.CST_Status === 'pending' && (
                        <button
                          className={`${styles.actionBtn} ${styles.successBtn}`}
                          title='Approve Casting'
                          onClick={() => openModal(casting, 'active')}
                        >
                          <FiCheck style={{ color: '#1e8e3e' }} />
                        </button>
                      )}

                      {casting.CST_Status === 'active' && (
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          title='Block Casting'
                          onClick={() => openModal(casting, 'blocked')}
                        >
                          <FiLock />
                        </button>
                      )}

                      {casting.CST_Status === 'blocked' && (
                        <button
                          className={styles.actionBtn}
                          title='Unblock / Activate'
                          onClick={() => openModal(casting, 'active')}
                        >
                          <FiUnlock />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {castingsTotalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page === 1 || loading}
            onClick={() => setPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {castingsCurrentPage} of {castingsTotalPages}
          </span>
          <button
            className={styles.pageBtn}
            disabled={page === castingsTotalPages || loading}
            onClick={() => setPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {isModalOpen && (
        <ModalWindow
          title={
            actionType === 'blocked'
              ? `Block "${selectedCasting?.CST_Title}"`
              : `Activate "${selectedCasting?.CST_Title}"?`
          }
          model={{ reason: '' }}
          fields={
            actionType === 'blocked'
              ? [
                  {
                    name: 'reason',
                    type: 'textarea',
                    placeholder: 'Provide a reason for the audit log...',
                  },
                ]
              : []
          }
          validationSchema={
            actionType === 'blocked'
              ? Yup.object({
                  reason: Yup.string().required(
                    'Reason is required for the audit log'
                  ),
                })
              : Yup.object()
          }
          submitLabel={
            actionType === 'blocked' ? 'Block Casting' : 'Confirm Activation'
          }
          onClose={closeModal}
          onSubmit={async values => {
            try {
              await dispatch(
                changeAdminCastingStatus({
                  id: selectedCasting.CST_ID,
                  data: {
                    status: actionType,
                    reason:
                      actionType === 'blocked'
                        ? values.reason
                        : 'Unblocked by administrator',
                  },
                })
              ).unwrap();

              dispatch(
                fetchAdminCastings({
                  status: statusFilter,
                  page,
                  limit: 10,
                  search: debouncedSearch,
                })
              );
            } catch (err) {
              alert('Помилка оновлення статусу: ' + err);
            }
          }}
        />
      )}
    </div>
  );
}
