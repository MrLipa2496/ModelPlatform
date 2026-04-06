import React from 'react';
import {
  FiDollarSign,
  FiCreditCard,
  FiRefreshCcw,
  FiShield,
  FiSettings,
  FiLock,
} from 'react-icons/fi';
import styles from './AdminPaymentsPage.module.sass';

export default function AdminPaymentsPage () {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <p className={styles.subtitle}>BILLING & PAYOUTS</p>
          <h1 className={styles.title}>Financial Hub</h1>
          <p className={styles.description}>
            Manage agency subscription plans, monitor escrow transactions, and
            process model payouts securely.
          </p>
        </div>
        <button
          className={styles.gatewayBtn}
          onClick={() => alert('Gateway configuration panel will open here.')}
        >
          <FiSettings /> Gateway Settings
        </button>
      </header>

      <div className={styles.financeGrid}>
        <div className={styles.financeCard}>
          <div className={`${styles.iconWrapper} ${styles.iconGreen}`}>
            <FiDollarSign />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>$0.00</span>
            <span className={styles.statLabel}>Net Revenue (30 Days)</span>
          </div>
        </div>

        <div className={styles.financeCard}>
          <div className={`${styles.iconWrapper} ${styles.iconYellow}`}>
            <FiRefreshCcw />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>Pending Payouts</span>
          </div>
        </div>

        <div className={styles.financeCard}>
          <div className={`${styles.iconWrapper} ${styles.iconBlue}`}>
            <FiCreditCard />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>Active Subscriptions</span>
          </div>
        </div>
      </div>

      <div className={styles.contentBox}>
        <div className={styles.placeholderIconWrapper}>
          <FiShield className={styles.placeholderIcon} />
        </div>
        <h2 className={styles.placeholderTitle}>
          Secure Payment Gateway Integration
        </h2>
        <p className={styles.placeholderText}>
          We are currently implementing PCI-compliant payment gateways (Stripe &
          PayPal) to handle agency subscriptions and secure escrow payments for
          models. Transaction history and invoice generation will appear here
          once the integration is complete.
        </p>

        <div className={styles.trustBadges}>
          <span>
            <FiLock /> 256-bit SSL Encryption
          </span>
          <span>
            <FiShield /> PCI-DSS Compliant
          </span>
        </div>
      </div>
    </div>
  );
}
