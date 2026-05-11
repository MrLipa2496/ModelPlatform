import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminReports,
  changeAdminReportStatus,
} from '../../../store/slices/adminSlice';
import {
  FiMessageSquare,
  FiClock,
  FiCheckCircle,
  FiMoreHorizontal,
  FiEye,
  FiCheck,
  FiX,
  FiAlertCircle,
} from 'react-icons/fi';
import Pagination from '../../../components/Pagination';
import ModalWindow from '../../../components/ModalWindow'; // <-- Проверь путь!
import InfoModal from '../../../components/InfoModal'; // <-- Проверь путь!
import CONSTANTS from '../../../utils/constants';
import styles from './AdminReportsPage.module.sass';

export default function AdminReportsPage () {
  const dispatch = useDispatch();

  const {
    reports,
    reportsTotalItems,
    reportsTotalPages,
    reportsCurrentPage,
    loading,
  } = useSelector(state => state.admin);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const tableRef = useRef(null);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminReports({ page: 1, limit: 10 }));
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
    if (newPage >= 1 && newPage <= reportsTotalPages) {
      dispatch(fetchAdminReports({ page: newPage, limit: 10 }));
      setActiveDropdown(null);
    }
  };

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleReadMessage = message => {
    setCurrentMessage(message);
    setIsMessageModalOpen(true);
    setActiveDropdown(null);
  };

  const handleStatusClick = (id, newStatus) => {
    setPendingStatusUpdate({ id, status: newStatus });
    setIsNoteModalOpen(true);
    setActiveDropdown(null);
  };

  const handleConfirmStatusUpdate = async values => {
    if (pendingStatusUpdate) {
      dispatch(
        changeAdminReportStatus({
          id: pendingStatusUpdate.id,
          data: {
            status: pendingStatusUpdate.status,
            adminNotes: values.adminNotes || '',
          },
        })
      );
    }
    setIsNoteModalOpen(false);
    setPendingStatusUpdate(null);
  };

  const renderStatusBadge = status => {
    switch (status) {
      case 'resolved':
        return (
          <span className={`${styles.badge} ${styles.badgeAccepted}`}>
            Resolved
          </span>
        );
      case 'rejected':
        return (
          <span className={`${styles.badge} ${styles.badgeRejected}`}>
            Rejected
          </span>
        );
      case 'in_progress':
        return (
          <span className={`${styles.badge} ${styles.badgeInProgress}`}>
            In Progress
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

  const renderTypeBadge = type => {
    switch (type) {
      case 'complaint':
        return (
          <span className={styles.typeDanger}>
            <FiAlertCircle /> Complaint
          </span>
        );
      case 'technical':
        return <span className={styles.typeWarning}>Technical</span>;
      case 'suggestion':
        return <span className={styles.typeSuccess}>Suggestion</span>;
      default:
        return <span className={styles.typeNeutral}>Other</span>;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <p className={styles.subtitle}>SUPPORT & MODERATION</p>
          <h1 className={styles.title}>Tickets & Reports</h1>
          <p className={styles.description}>
            Manage user complaints, technical issues, and platform suggestions.
            Ensure a safe and stable environment for all users.
          </p>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconBlue}`}>
            <FiMessageSquare />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{reportsTotalItems}</span>
            <span className={styles.statLabel}>Total Tickets</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconOrange}`}>
            <FiClock />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {reports.filter(r => r.RPT_Status === 'pending').length}
            </span>
            <span className={styles.statLabel}>Pending on this page</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconGreen}`}>
            <FiCheckCircle />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {reports.filter(r => r.RPT_Status === 'resolved').length}
            </span>
            <span className={styles.statLabel}>Resolved on this page</span>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer} ref={tableRef}>
        <h2 className={styles.tableTitle}>Recent Support Tickets</h2>

        {loading && reports.length === 0 ? (
          <div className={styles.loadingState}>Loading reports data...</div>
        ) : reports.length === 0 ? (
          <div className={styles.emptyState}>
            No reports or tickets found. Great job!
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Sender</th>
                  <th>Reported User</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => {
                  const sender = report.Sender || {};
                  const reported = report.ReportedUser;
                  const isDropdownOpen = activeDropdown === report.RPT_ID;

                  return (
                    <tr key={report.RPT_ID}>
                      <td className={styles.idCell}>#{report.RPT_ID}</td>
                      <td>{renderTypeBadge(report.RPT_Type)}</td>
                      <td
                        className={styles.subjectCell}
                        title={report.RPT_Subject}
                      >
                        {report.RPT_Subject}
                      </td>
                      <td>
                        <div className={styles.userCell}>
                          <span>
                            {sender.USR_Email || `User #${sender.USR_ID}`}
                          </span>
                          <span className={styles.roleText}>
                            {sender.USR_Role}
                          </span>
                        </div>
                      </td>
                      <td>
                        {reported ? (
                          <div className={styles.userCell}>
                            <span>
                              {reported.USR_Email || `User #${reported.USR_ID}`}
                            </span>
                            <span className={styles.roleText}>
                              {reported.USR_Role}
                            </span>
                          </div>
                        ) : (
                          <span className={styles.roleText}>—</span>
                        )}
                      </td>
                      <td className={styles.dateCell}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td>{renderStatusBadge(report.RPT_Status)}</td>

                      <td className={styles.actionsCell}>
                        <button
                          className={`${styles.actionBtn} ${
                            isDropdownOpen ? styles.actionBtnActive : ''
                          }`}
                          onClick={e => toggleDropdown(report.RPT_ID, e)}
                        >
                          <FiMoreHorizontal />
                        </button>

                        {isDropdownOpen && (
                          <div className={styles.dropdownMenu}>
                            <button
                              className={styles.dropdownItem}
                              onClick={() =>
                                handleReadMessage(report.RPT_Message)
                              }
                            >
                              <FiEye /> Read Message
                            </button>

                            {report.RPT_Attachment && (
                              <button
                                className={styles.dropdownItem}
                                onClick={() =>
                                  window.open(
                                    `${CONSTANTS.BASE_URL}${report.RPT_Attachment}`,
                                    '_blank'
                                  )
                                }
                              >
                                <FiEye /> View Attachment
                              </button>
                            )}

                            <div className={styles.dropdownDivider}></div>

                            <button
                              className={styles.dropdownItem}
                              onClick={() =>
                                handleStatusClick(report.RPT_ID, 'in_progress')
                              }
                            >
                              <FiClock /> Mark In Progress
                            </button>
                            <button
                              className={`${styles.dropdownItem} ${styles.resolveItem}`}
                              onClick={() =>
                                handleStatusClick(report.RPT_ID, 'resolved')
                              }
                            >
                              <FiCheck /> Resolve Ticket
                            </button>
                            <button
                              className={`${styles.dropdownItem} ${styles.rejectItem}`}
                              onClick={() =>
                                handleStatusClick(report.RPT_ID, 'rejected')
                              }
                            >
                              <FiX /> Reject Ticket
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
      </div>

      {reportsTotalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={reportsCurrentPage}
            totalPages={reportsTotalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <InfoModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title='Ticket Details'
        showSignupBtn={false}
      >
        <div
          style={{
            whiteSpace: 'pre-wrap',
            color: '#475569',
            lineHeight: '1.6',
            fontSize: '0.95rem',
          }}
        >
          {currentMessage}
        </div>
      </InfoModal>

      {isNoteModalOpen && (
        <ModalWindow
          title={`Confirm Action: ${pendingStatusUpdate?.status
            .replace('_', ' ')
            .toUpperCase()}`}
          model={{ adminNotes: '' }}
          fields={[
            {
              name: 'adminNotes',
              type: 'textarea',
              label: 'Admin Note (Optional)',
              placeholder: 'Add a reason or internal note for this decision...',
            },
          ]}
          submitLabel='Update Status'
          onClose={() => {
            setIsNoteModalOpen(false);
            setPendingStatusUpdate(null);
          }}
          onSubmit={handleConfirmStatusUpdate}
        />
      )}
    </div>
  );
}
