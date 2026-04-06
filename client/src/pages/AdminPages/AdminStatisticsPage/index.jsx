import React from 'react';
import {
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiArrowUpRight,
  FiArrowDownRight,
  FiMinus,
} from 'react-icons/fi';
import styles from './AdminStatisticsPage.module.sass';

export default function AdminStatisticsPage () {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <p className={styles.subtitle}>COMMAND CENTER</p>
          <h1 className={styles.title}>Global Statistics</h1>
          <p className={styles.description}>
            Monitor platform health, user acquisition trends, and casting
            engagement metrics in real-time.
          </p>
        </div>
        <button
          className={styles.filterBtn}
          onClick={() => alert('Date range selector is currently disabled.')}
        >
          <FiCalendar /> Last 30 Days
        </button>
      </header>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Users</span>
            <FiUsers className={styles.kpiIcon} />
          </div>
          <span className={styles.kpiValue}>0</span>
          <span className={`${styles.kpiTrend} ${styles.trendUp}`}>
            <FiArrowUpRight /> +0% from last month
          </span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Active Castings</span>
            <FiBarChart2 className={styles.kpiIcon} />
          </div>
          <span className={styles.kpiValue}>0</span>
          <span className={`${styles.kpiTrend} ${styles.trendNeutral}`}>
            <FiMinus /> 0% from last month
          </span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Match Rate</span>
            <FiTrendingUp className={styles.kpiIcon} />
          </div>
          <span className={styles.kpiValue}>0%</span>
          <span className={`${styles.kpiTrend} ${styles.trendDown}`}>
            <FiArrowDownRight /> -0% from last month
          </span>
        </div>
      </div>

      <div className={styles.chartsPlaceholder}>
        <div className={styles.chartBox}>
          <div className={styles.gridBg}></div>
          <div className={styles.chartContent}>
            <FiBarChart2 className={styles.chartIcon} />
            <h3 className={styles.chartTitle}>Growth Timeline Visualization</h3>
            <p className={styles.chartText}>
              The interactive chart module (Chart.js / D3.js) is currently being
              integrated. Soon this area will display a timeline of new user
              registrations and platform activity.
            </p>
          </div>
        </div>

        <div className={styles.chartBox}>
          <div className={styles.gridBg}></div>
          <div className={styles.chartContent}>
            <FiPieChart className={styles.chartIcon} />
            <h3 className={styles.chartTitle}>Demographics</h3>
            <p className={styles.chartText}>
              A breakdown of Models vs. Agencies and geographical distribution
              will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
