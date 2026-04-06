import React from 'react';
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiPlus,
  FiInbox,
} from 'react-icons/fi';
import styles from './AdminOffersPage.module.sass';

export default function AdminOffersPage () {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <p className={styles.subtitle}>MONETIZATION & CONTRACTS</p>
          <h1 className={styles.title}>Offers Management</h1>
          <p className={styles.description}>
            Track premium placements, direct agency-model contracts, and special
            commercial offers on the platform.
          </p>
        </div>
        <button
          className={styles.createBtn}
          onClick={() => alert('Offer creation module is in development.')}
        >
          <FiPlus /> New Offer Campaign
        </button>
      </header>

      {/* STATS SKELETON */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconBlue}`}>
            <FiFileText />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>Active Offers</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconOrange}`}>
            <FiClock />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>Pending Contracts</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconGreen}`}>
            <FiCheckCircle />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>0%</span>
            <span className={styles.statLabel}>Conversion Rate</span>
          </div>
        </div>
      </div>

      <div className={styles.contentBox}>
        <div className={styles.placeholderIconWrapper}>
          <FiInbox className={styles.placeholderIcon} />
        </div>
        <h2 className={styles.placeholderTitle}>Module in Development</h2>
        <p className={styles.placeholderText}>
          The Offers Management system is currently being integrated. Soon you
          will be able to monitor direct bookings, manage premium agency
          subscriptions, and generate commercial reports here.
        </p>
        <button
          className={styles.secondaryBtn}
          onClick={() =>
            alert(
              'Notifications enabled. We will notify you when this module is live.'
            )
          }
        >
          Notify me when available
        </button>
      </div>
    </div>
  );
}
