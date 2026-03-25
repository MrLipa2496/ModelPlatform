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
import styles from './AdminHome.module.sass';

export default function AdminHome () {
  const dispatch = useDispatch();
  const { stats: dashboardData } = useSelector(state => state.admin);

  // Состояние для хранения ID карточки, на которую навели мышку
  const [hoveredModule, setHoveredModule] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  // Разбираем данные с бэкенда (защита от undefined при первой загрузке)
  const stats = dashboardData?.stats || {
    totalModels: 0,
    activeAgencies: 0,
    activeCastings: 0,
    pendingUsers: 0,
  };
  const recent = dashboardData?.recent || {
    pending: [],
    users: [],
    castings: [],
  };

  // Конфигурация наших модулей
  const adminModules = [
    {
      id: 'verify',
      path: '/admin/verify',
      icon: FiCheckSquare,
      title: 'Verification',
      subtitle: 'KYC & Approvals',
      description:
        'Review and approve pending registrations for new models and agencies.',
      recentData: recent.pending.map(m => ({
        label: `${m.MOD_FirstName} ${m.MOD_LastName}`,
        status: 'Pending',
      })),
    },
    {
      id: 'users',
      path: '/admin/users',
      icon: FiUsers,
      title: 'Users',
      subtitle: 'Manage Accounts',
      description: 'Search, manage, and block active users on the platform.',
      recentData: recent.users.map(u => ({
        label: `${u.MOD_FirstName} ${u.MOD_LastName}`,
        status: u.MOD_Status,
      })),
    },
    {
      id: 'castings',
      path: '/admin/castings',
      icon: FiBriefcase,
      title: 'Castings',
      subtitle: 'Content Control',
      description:
        'Monitor all active job postings and remove inappropriate content.',
      recentData: recent.castings.map(c => ({
        label: c.CST_Title,
        status: c.CST_Status,
      })),
    },
    {
      id: 'offers',
      path: '/admin/offers',
      icon: FiSend,
      title: 'Offers',
      subtitle: 'Direct Collaborations',
      description:
        'Audit direct collaboration offers between agencies and models.',
      recentData: [], // Пока нет данных
    },
    {
      id: 'reports',
      path: '/admin/reports',
      icon: FiFlag,
      title: 'Reports',
      subtitle: 'User Complaints',
      description:
        'Handle user-submitted reports regarding inappropriate behavior.',
      recentData: [],
    },
    {
      id: 'statistics',
      path: '/admin/statistics',
      icon: FiBarChart2,
      title: 'Statistics',
      subtitle: 'Platform Analytics',
      description:
        'View detailed analytics on platform growth and user engagement.',
      recentData: [],
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* ... Секция HEADER остается без изменений ... */}
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
        {/* ... Секция OVERVIEW STATS (4 карточки) остается без изменений ... */}

        {/* QUICK ACCESS MODULES */}
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
                {/* Видимая часть карточки (всегда) */}
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

                {/* Скрытая часть карточки (появляется при наведении) */}
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

            {/* Карточка PAYMENTS (Отключена) */}
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
