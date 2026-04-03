import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAgencyProfile } from '../../../store/slices/agencySlice';
import { fetchMyCastings } from '../../../store/slices/castingSlice';
import { fetchAgencyApplications } from '../../../store/slices/applicationSlice';
import {
  FiBriefcase,
  FiUsers,
  FiPlusCircle,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiMail,
  FiArrowRight,
  FiSettings,
  FiTrendingUp,
  FiFileText, // <-- Добавили иконку для текста причины
} from 'react-icons/fi';
import styles from './AgencyHome.module.sass';
import CONSTANTS from '../../../utils/constants';

export default function AgencyHome () {
  const dispatch = useDispatch();

  const { data: agencyProfile, loading: profileLoading } = useSelector(
    state => state.agency
  );

  const { totalItems: totalCastings } = useSelector(state => state.casting);
  const { totalItems: totalApplicants } = useSelector(
    state => state.application
  );

  useEffect(() => {
    if (!agencyProfile) {
      dispatch(fetchAgencyProfile());
    }
    dispatch(fetchMyCastings({ page: 1, limit: 1 }));

    dispatch(fetchAgencyApplications({ page: 1, limit: 1 }));
  }, [dispatch, agencyProfile]);

  if (profileLoading && !agencyProfile) {
    return <div className={styles.loader}>Loading workspace...</div>;
  }

  const agencyName = agencyProfile?.AGN_Name || 'My Agency';
  const status = agencyProfile?.AGN_Status || 'pending';
  const agencyLogo = agencyProfile?.AGN_Logo || null;
  const rejectionReason =
    agencyProfile?.AGN_RejectionReason ||
    'No specific reason provided. Please contact support.';

  const stats = {
    activeCastings: totalCastings || 0,
    newApplicants: totalApplicants || 0,
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.workspaceHeader}>
        <div className={styles.headerInner}>
          <div className={styles.agencyIdentity}>
            <div className={styles.logoWrapper}>
              {agencyLogo ? (
                <img
                  src={`${CONSTANTS.BASE_URL}${agencyLogo}`}
                  alt='Agency Logo'
                />
              ) : (
                <span className={styles.logoPlaceholder}>
                  {agencyName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className={styles.identityText}>
              <p className={styles.subtitle}>AGENCY WORKSPACE</p>
              <h1 className={styles.welcomeTitle}>
                <span
                  className={`${
                    status === 'active' ? styles.verifiedName : ''
                  }`}
                >
                  {agencyName.toUpperCase()}
                </span>
              </h1>
              <div className={styles.statusBadgeRow}>
                <span className={`${styles.statusBadge} ${styles[status]}`}>
                  {status.toUpperCase()}
                </span>
                {status === 'active' && (
                  <FiCheckCircle className={styles.verifiedIcon} />
                )}
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <Link to='/myCastings' className={styles.primaryActionBtn}>
              <FiPlusCircle className={styles.btnIcon} />
              Post a Casting
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.dashboardContent}>
        {/* --- OVERVIEW SECTION --- */}
        <div className={styles.overviewGrid}>
          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>
              <h2 className={styles.sectionTitle}>Performance</h2>
              <FiTrendingUp className={styles.widgetIcon} />
            </div>
            <div className={styles.statsContent}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{stats.activeCastings}</div>
                <div className={styles.statLabel}>Active Castings</div>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{stats.newApplicants}</div>
                <div className={styles.statLabel}>New Applicants</div>
              </div>
            </div>
          </div>

          <div className={styles.widgetCard}>
            <h2 className={styles.sectionTitle}>System Status</h2>
            <div className={styles.alertsWrapper}>
              {status === 'pending' ? (
                <div className={`${styles.alertBox} ${styles.warningAlert}`}>
                  <FiAlertCircle className={styles.alertIcon} />
                  <div>
                    <h3>Under Review</h3>
                    <p>
                      Your agency account is waiting for administrator approval.
                      You cannot publish castings yet.
                    </p>
                  </div>
                </div>
              ) : status === 'blocked' ? (
                <div className={`${styles.alertBox} ${styles.errorAlert}`}>
                  <FiAlertCircle className={styles.alertIcon} />
                  <div>
                    <h3>Account Declined</h3>
                    <p style={{ marginBottom: '8px' }}>
                      Your registration was declined. Please contact support for
                      more details.
                    </p>
                    <div
                      style={{
                        background: 'rgba(255,0,0,0.05)',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        borderLeft: '3px solid #dc3545',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'flex-start',
                        marginTop: '8px',
                      }}
                    >
                      <FiFileText
                        style={{
                          color: '#dc3545',
                          marginTop: '3px',
                          flexShrink: 0,
                        }}
                      />
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          color: '#b02a37',
                          fontWeight: '500',
                        }}
                      >
                        {rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${styles.alertBox} ${styles.successAlert}`}>
                  <FiCheckCircle className={styles.alertIcon} />
                  <div>
                    <h3>Account Verified</h3>
                    <p>
                      You have full access to publish castings and contact
                      models.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- OPPORTUNITIES --- */}
        <section className={styles.opportunitiesSection}>
          <h2 className={styles.sectionTitle}>Manage Operations</h2>
          <div className={styles.actionGrid}>
            <Link to='/models' className={styles.actionCard}>
              <div className={styles.cardHeader}>
                <FiUsers className={styles.cardIcon} />
                <h3>Discover Models</h3>
              </div>
              <p>
                Browse our verified database of professional models and invite
                them to your castings.
              </p>
              <div className={styles.cardFooter}>
                Find talent <FiArrowRight />
              </div>
            </Link>

            <Link to='/myCastings' className={styles.actionCard}>
              <div className={styles.cardHeader}>
                <FiBriefcase className={styles.cardIcon} />
                <h3>My Castings</h3>
              </div>
              <p>
                Manage your active job postings, edit details, or close
                completed castings.
              </p>
              <div className={styles.cardFooter}>
                Manage jobs <FiArrowRight />
              </div>
            </Link>

            <Link to='/applicants' className={styles.actionCard}>
              <div className={styles.cardHeader}>
                <FiCheckCircle className={styles.cardIcon} />
                <h3>Applicants</h3>
              </div>
              <p>
                Review model applications, approve candidates, and organize your
                shoots.
              </p>
              <div className={styles.cardFooter}>
                Review talent <FiArrowRight />
              </div>
            </Link>

            <Link to='/profile' className={styles.actionCard}>
              <div className={styles.cardHeader}>
                <FiSettings className={styles.cardIcon} />
                <h3>Agency Profile</h3>
              </div>
              <p>
                Update your company details, logo, and contact information for
                models.
              </p>
              <div className={styles.cardFooter}>
                Edit settings <FiArrowRight />
              </div>
            </Link>
          </div>
        </section>

        {/* --- PLATFORM RESOURCES --- */}
        <section className={styles.resourcesSection}>
          <h2 className={styles.sectionTitle}>Resources</h2>
          <div className={styles.resourceGrid}>
            <Link to='/about' className={styles.resourceCard}>
              <FiInfo className={styles.resourceIcon} />
              <div className={styles.resourceText}>
                <h3>About LipaX</h3>
                <p>
                  Learn how our platform connects independent models with global
                  agencies.
                </p>
              </div>
            </Link>

            <Link to='/contacts' className={styles.resourceCard}>
              <FiMail className={styles.resourceIcon} />
              <div className={styles.resourceText}>
                <h3>Help & Support</h3>
                <p>
                  Need assistance? Contact our team for technical support or
                  general questions.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
