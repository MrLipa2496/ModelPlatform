import React from 'react';
import {
  FiPieChart,
  FiDownload,
  FiTrendingUp,
  FiUsers,
  FiActivity,
} from 'react-icons/fi';
import styles from './AdminReportsPage.module.sass';

export default function AdminReportsPage () {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <p className={styles.subtitle}>ANALYTICS & EXPORTS</p>
          <h1 className={styles.title}>Reports Engine</h1>
          <p className={styles.description}>
            Generate detailed insights on user growth, casting engagement, and
            platform performance. Export data securely.
          </p>
        </div>
        <button
          className={styles.exportBtn}
          onClick={() => alert('Export engine is currently initializing...')}
        >
          <FiDownload /> Export Master Data
        </button>
      </header>

      <div className={styles.analyticsGrid}>
        <div className={styles.reportCard}>
          <div className={`${styles.iconWrapper} ${styles.iconPurple}`}>
            <FiUsers />
          </div>
          <div className={styles.reportInfo}>
            <span className={styles.reportTitle}>User Demographics</span>
            <span className={styles.reportDesc}>
              Age, location, and parameters breakdown for all active models.
            </span>
          </div>
        </div>

        <div className={styles.reportCard}>
          <div className={`${styles.iconWrapper} ${styles.iconTeal}`}>
            <FiTrendingUp />
          </div>
          <div className={styles.reportInfo}>
            <span className={styles.reportTitle}>Agency Activity</span>
            <span className={styles.reportDesc}>
              Casting posting frequency and application approval rates.
            </span>
          </div>
        </div>

        <div className={styles.reportCard}>
          <div className={`${styles.iconWrapper} ${styles.iconRed}`}>
            <FiActivity />
          </div>
          <div className={styles.reportInfo}>
            <span className={styles.reportTitle}>System Health</span>
            <span className={styles.reportDesc}>
              API load, database storage metrics, and active sessions.
            </span>
          </div>
        </div>
      </div>

      <div className={styles.contentBox}>
        <div className={styles.placeholderIconWrapper}>
          <FiPieChart className={styles.placeholderIcon} />
        </div>
        <h2 className={styles.placeholderTitle}>
          Advanced Analytics Coming Soon
        </h2>
        <p className={styles.placeholderText}>
          We are building a powerful reporting engine with interactive charts
          and automated PDF/CSV exports. This will help you make data-driven
          decisions for the platform.
        </p>
        <button
          className={styles.primaryBtn}
          onClick={() =>
            alert(
              'You have been subscribed to updates for the Analytics Module.'
            )
          }
        >
          Request Early Access
        </button>
      </div>
    </div>
  );
}
