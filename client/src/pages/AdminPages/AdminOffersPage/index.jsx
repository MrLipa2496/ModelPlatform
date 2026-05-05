import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminInvitations,
  fetchAdminStatistics,
} from '../../../store/slices/adminSlice';
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiPlus,
  FiMoreHorizontal,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiXCircle,
  FiTrash2,
} from 'react-icons/fi';
import CONSTANTS from '../../../utils/constants';
import defaultAvatar from '../../../../img/default-avatar.jpg';
import styles from './AdminOffersPage.module.sass';

export default function AdminOffersPage () {
  const dispatch = useDispatch();

  const {
    invitations,
    invitationsTotalItems,
    invitationsTotalPages,
    invitationsCurrentPage,
    loading,
    statistics,
  } = useSelector(state => state.admin);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAdminInvitations({ page: 1, limit: 10 }));
    dispatch(fetchAdminStatistics());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= invitationsTotalPages) {
      dispatch(fetchAdminInvitations({ page: newPage, limit: 10 }));
      setActiveDropdown(null);
    }
  };

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const renderStatusBadge = status => {
    switch (status) {
      case 'accepted':
        return (
          <span className={`${styles.badge} ${styles.badgeAccepted}`}>
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className={`${styles.badge} ${styles.badgeRejected}`}>
            Declined
          </span>
        );
      case 'pending':
      default:
        return (
          <span className={`${styles.badge} ${styles.badgePending}`}>
            Pending
          </span>
        );
    }
  };

  const invStats = statistics?.economy?.invitationsByStatus || {};
  const totalAccepted = invStats.accepted || 0;
  const totalPending = invStats.pending || 0;
  const totalOffers =
    (invStats.accepted || 0) +
    (invStats.pending || 0) +
    (invStats.rejected || 0);
  const conversionRate =
    totalOffers > 0 ? Math.round((totalAccepted / totalOffers) * 100) : 0;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <p className={styles.subtitle}>MONETIZATION & CONTRACTS</p>
          <h1 className={styles.title}>Offers Management</h1>
          <p className={styles.description}>
            Track premium placements, direct agency-model contracts, and
            platform activity in real-time.
          </p>
        </div>
        <button
          className={styles.createBtn}
          onClick={() => alert('Offer campaigns module is in development.')}
        >
          <FiPlus /> New Offer Campaign
        </button>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconBlue}`}>
            <FiFileText />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalOffers}</span>
            <span className={styles.statLabel}>Total Offers Sent</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconOrange}`}>
            <FiClock />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalPending}</span>
            <span className={styles.statLabel}>Pending Contracts</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconGreen}`}>
            <FiCheckCircle />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{conversionRate}%</span>
            <span className={styles.statLabel}>Conversion Rate</span>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer} ref={tableRef}>
        <h2 className={styles.tableTitle}>Recent Platform Offers</h2>

        {loading && invitations.length === 0 ? (
          <div className={styles.loadingState}>Loading offers data...</div>
        ) : invitations.length === 0 ? (
          <div className={styles.emptyState}>
            No offers found on the platform yet.
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Agency (Sender)</th>
                  <th>Model (Recipient)</th>
                  <th>Casting Project</th>
                  <th>Date Sent</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map(invite => {
                  const agency = invite.Agency || {};
                  const model = invite.Model || {};
                  const casting = invite.Casting || {};
                  const isDropdownOpen = activeDropdown === invite.INV_ID;

                  return (
                    <tr key={invite.INV_ID}>
                      <td className={styles.idCell}>#{invite.INV_ID}</td>
                      <td>
                        <div className={styles.userCell}>
                          <img
                            src={
                              agency.AGN_Logo
                                ? `${CONSTANTS.BASE_URL}${agency.AGN_Logo}`
                                : defaultAvatar
                            }
                            alt='Agency'
                          />
                          <span className={styles.boldText}>
                            {agency.AGN_Name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.userCell}>
                          <img
                            src={
                              model.MOD_Photo
                                ? `${CONSTANTS.BASE_URL}${model.MOD_Photo}`
                                : defaultAvatar
                            }
                            alt='Model'
                          />
                          <span>
                            {model.MOD_FirstName} {model.MOD_LastName}
                          </span>
                        </div>
                      </td>
                      <td className={styles.castingCell}>
                        {casting.CST_Title || 'Deleted Casting'}
                      </td>
                      <td className={styles.dateCell}>
                        {new Date(invite.INV_SentAt).toLocaleDateString()}
                      </td>
                      <td>{renderStatusBadge(invite.INV_Status)}</td>

                      <td className={styles.actionsCell}>
                        <button
                          className={`${styles.actionBtn} ${
                            isDropdownOpen ? styles.actionBtnActive : ''
                          }`}
                          onClick={e => toggleDropdown(invite.INV_ID, e)}
                        >
                          <FiMoreHorizontal />
                        </button>

                        {isDropdownOpen && (
                          <div className={styles.dropdownMenu}>
                            <button
                              className={styles.dropdownItem}
                              onClick={() => alert('View details logic here')}
                            >
                              <FiEye /> View full details
                            </button>
                            {invite.INV_Status === 'pending' && (
                              <button
                                className={styles.dropdownItem}
                                onClick={() => alert('Revoke logic here')}
                              >
                                <FiXCircle /> Revoke offer
                              </button>
                            )}
                            <div className={styles.dropdownDivider}></div>
                            <button
                              className={`${styles.dropdownItem} ${styles.deleteItem}`}
                              onClick={() => alert('Delete logic here')}
                            >
                              <FiTrash2 /> Delete record
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {invitationsTotalPages > 1 && (
          <div className={styles.pagination}>
            <span className={styles.pageInfo}>
              Showing page {invitationsCurrentPage} of {invitationsTotalPages} (
              {invitationsTotalItems} total)
            </span>
            <div className={styles.pageControls}>
              <button
                disabled={invitationsCurrentPage === 1 || loading}
                onClick={() => handlePageChange(invitationsCurrentPage - 1)}
              >
                <FiChevronLeft /> Prev
              </button>
              <button
                disabled={
                  invitationsCurrentPage === invitationsTotalPages || loading
                }
                onClick={() => handlePageChange(invitationsCurrentPage + 1)}
              >
                Next <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
