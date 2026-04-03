import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiBriefcase,
  FiShield,
  FiActivity,
  FiCheckSquare,
  FiFlag,
  FiSend,
  FiBarChart2,
  FiCreditCard,
  FiChevronRight,
} from 'react-icons/fi';
import { fetchAdminStats } from '../../../store/slices/adminSlice';
import CONSTANTS from '../../../utils/constants';
import styles from './AdminHome.module.sass';

const MODULE_ICONS = {
  verify: FiCheckSquare,
  users: FiUsers,
  castings: FiBriefcase,
  offers: FiSend,
  reports: FiFlag,
  statistics: FiBarChart2,
};

const getRecentDataForModule = (moduleId, recentData) => {
  switch (moduleId) {
    case 'verify':
      return recentData.pending.map(m => ({
        label: `${m.MOD_FirstName} ${m.MOD_LastName}`,
        status: 'Pending',
      }));
    case 'users':
      return recentData.users.map(u => ({
        label: `${u.MOD_FirstName} ${u.MOD_LastName}`,
        status: u.MOD_Status,
      }));
    case 'castings':
      return recentData.castings.map(c => ({
        label: c.CST_Title,
        status: c.CST_Status,
      }));
    default:
      return [];
  }
};

export default function AdminHome () {
  const dispatch = useDispatch();
  const { stats: dashboardData } = useSelector(state => state.admin);
  const [hoveredModule, setHoveredModule] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const stats = dashboardData?.stats || CONSTANTS.DEFAULT_ADMIN_STATS;
  const recent = dashboardData?.recent || CONSTANTS.DEFAULT_ADMIN_RECENT;

  const adminModules = CONSTANTS.ADMIN_DASHBOARD_MODULES.map(mod => ({
    ...mod,
    icon: MODULE_ICONS[mod.id] || FiActivity,
    recentData: getRecentDataForModule(mod.id, recent),
  }));

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.workspaceHeader}>
        <div className={styles.headerInner}>
          <div className={styles.identityText}>
            <p className={styles.subtitle}>ADMINISTRATION</p>
            <h1 className={styles.welcomeTitle}>System Workspace</h1>
            <div className={styles.adminBadge}>
              <FiShield className={styles.shieldIcon} />
              <span>Superadmin</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.dashboardContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <FiUsers className={styles.statIcon} />
                <span className={styles.statLabel}>Models</span>
              </div>
              <div className={styles.statValue}>{stats.totalModels}</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <FiBriefcase className={styles.statIcon} />
                <span className={styles.statLabel}>Agencies</span>
              </div>
              <div className={styles.statValue}>{stats.totalAgencies}</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <FiActivity className={styles.statIcon} />
                <span className={styles.statLabel}>Castings</span>
              </div>
              <div className={styles.statValue}>{stats.activeCastings}</div>
            </div>

            <div className={`${styles.statCard} ${styles.highlightCard}`}>
              <div className={styles.statHeader}>
                <span className={styles.indicatorPulse}></span>
                <span className={styles.statLabelHighlight}>
                  Pending Approval
                </span>
              </div>
              <div className={styles.statValueHighlight}>
                {stats.pendingUsers}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Modules</h2>

          <div className={styles.modulesGrid}>
            {adminModules.map(mod => (
              <Link
                key={mod.id}
                to={mod.path}
                className={`${styles.moduleCard} ${
                  hoveredModule === mod.id ? styles.expanded : ''
                }`}
                onMouseEnter={() => setHoveredModule(mod.id)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                <div className={styles.moduleVisible}>
                  <div className={styles.moduleIconWrapper}>
                    <mod.icon className={styles.moduleIcon} />
                  </div>
                  <div className={styles.moduleInfo}>
                    <h3>{mod.title}</h3>
                    <span>{mod.subtitle}</span>
                  </div>
                  <FiChevronRight className={styles.moduleArrow} />
                </div>

                <div className={styles.moduleHidden}>
                  <p className={styles.moduleDesc}>{mod.description}</p>

                  {mod.recentData && mod.recentData.length > 0 && (
                    <div className={styles.recentList}>
                      <span className={styles.recentTitle}>
                        Recent Activity:
                      </span>
                      {mod.recentData.map((item, idx) => (
                        <div key={idx} className={styles.recentItem}>
                          <span className={styles.recentItemLabel}>
                            {item.label}
                          </span>
                          <span
                            className={`${styles.recentItemStatus} ${
                              styles[item.status] || ''
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}

            <div className={`${styles.moduleCard} ${styles.disabledCard}`}>
              <div className={styles.moduleVisible}>
                <div className={styles.moduleIconWrapper}>
                  <FiCreditCard className={styles.moduleIcon} />
                </div>
                <div className={styles.moduleInfo}>
                  <h3>Payments</h3>
                  <span className={styles.comingSoon}>Coming Soon</span>
                </div>
                <FiChevronRight className={styles.moduleArrow} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
