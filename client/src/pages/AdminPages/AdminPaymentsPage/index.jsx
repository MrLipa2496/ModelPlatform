import React, { useState, useEffect } from 'react';
import {
  FiDollarSign,
  FiCreditCard,
  FiTrendingUp,
  FiActivity,
} from 'react-icons/fi';
import InfoModal from '../../../components/InfoModal'; // Проверь путь!
import styles from './AdminPaymentsPage.module.sass'; // Можем переиспользовать стили статистики для структуры

export default function AdminPaymentsPage () {
  const [isDevelopmentModalOpen, setIsDevelopmentModalOpen] = useState(false);

  useEffect(() => {
    setIsDevelopmentModalOpen(true);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <p className={styles.subtitle}>FINANCE & BILLING</p>
          <h1 className={styles.title}>Payments & Subscriptions</h1>
          <p className={styles.description}>
            Manage platform revenue, agency subscription plans, and premium
            placements.
          </p>
        </div>
      </header>

      <div style={{ opacity: 0.4, pointerEvents: 'none' }}>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>Total Revenue</span>
              <div
                className={styles.iconWrapper}
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                }}
              >
                <FiDollarSign />
              </div>
            </div>
            <span className={styles.kpiValue}>$0.00</span>
            <span className={styles.kpiSubtext}>This month</span>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>Active Subscriptions</span>
              <div
                className={styles.iconWrapper}
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                }}
              >
                <FiCreditCard />
              </div>
            </div>
            <span className={styles.kpiValue}>0</span>
            <span className={styles.kpiSubtext}>Pro Agencies</span>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>MRR</span>
              <div
                className={styles.iconWrapper}
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                }}
              >
                <FiTrendingUp />
              </div>
            </div>
            <span className={styles.kpiValue}>$0.00</span>
            <span className={styles.kpiSubtext}>Monthly Recurring Revenue</span>
          </div>
        </div>

        <div className={styles.loadingState} style={{ marginTop: '20px' }}>
          Payment modules are not yet initialized...
        </div>
      </div>

      <InfoModal
        isOpen={isDevelopmentModalOpen}
        onClose={() => setIsDevelopmentModalOpen(false)}
        title='Module in Development'
        showSignupBtn={false}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px 0',
          }}
        >
          <FiActivity
            style={{ fontSize: '3rem', color: '#3b82f6', marginBottom: '20px' }}
          />
          <h3
            style={{
              margin: '0 0 10px 0',
              fontSize: '1.2rem',
              color: '#0f172a',
            }}
          >
            Payments Integration is Coming Soon!
          </h3>
          <p
            style={{
              color: '#475569',
              lineHeight: '1.6',
              margin: 0,
              fontSize: '0.95rem',
            }}
          >
            The financial and billing module is currently under active
            development. Integration with Stripe and PayPal will be available in
            the next major update to support agency premium subscriptions and
            paid casting placements.
          </p>
        </div>
      </InfoModal>
    </div>
  );
}
