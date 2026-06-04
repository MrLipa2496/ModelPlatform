import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiBarChart2,
  FiBriefcase,
  FiPieChart,
  FiUsers,
  FiActivity,
  FiImage,
  FiMessageSquare,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { fetchAdminStatistics } from '../../../store/slices/adminSlice';
import styles from './AdminStatisticsPage.module.sass';

const COLORS_GENDER = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b'];
const COLORS_STATUS = {
  active: '#10b981',
  pending: '#f59e0b',
  blocked: '#ef4444',
  closed: '#6b7280',
};

export default function AdminStatisticsPage () {
  const dispatch = useDispatch();
  const { statistics, loading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStatistics());
  }, [dispatch]);

  const usersStatusData = useMemo(() => {
    const { modelsByStatus = {}, agenciesByStatus = {} } =
      statistics?.users || {};
    const allStatuses = [
      ...new Set([
        ...Object.keys(modelsByStatus),
        ...Object.keys(agenciesByStatus),
      ]),
    ];

    return allStatuses.map(status => ({
      name: status.toUpperCase(),
      Models: modelsByStatus[status] || 0,
      Agencies: agenciesByStatus[status] || 0,
    }));
  }, [statistics]);

  const genderData = useMemo(() => {
    const { genderRatio = {} } = statistics?.demographics || {};
    return Object.entries(genderRatio).map(([key, value]) => ({
      name: key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Unknown',
      value: value,
    }));
  }, [statistics]);

  const castingsData = useMemo(() => {
    const { castingsByStatus = {} } = statistics?.economy || {};
    return Object.entries(castingsByStatus).map(([key, value]) => ({
      name: key.toUpperCase(),
      value: value,
      color: COLORS_STATUS[key] || '#cbd5e1',
    }));
  }, [statistics]);

  const engagementData = useMemo(() => {
    const { applicationsByStatus = {}, invitationsByStatus = {} } =
      statistics?.economy || {};
    const allStatuses = [
      ...new Set([
        ...Object.keys(applicationsByStatus),
        ...Object.keys(invitationsByStatus),
      ]),
    ];

    return allStatuses.map(status => ({
      name: status.toUpperCase(),
      Applications: applicationsByStatus[status] || 0,
      Invitations: invitationsByStatus[status] || 0,
    }));
  }, [statistics]);

  const kpi = statistics?.kpi || {};
  const content = statistics?.content || {};

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{ color: entry.color, margin: 0, fontWeight: 500 }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <p className={styles.subtitle}>COMMAND CENTER</p>
          <h1 className={styles.title}>Global Statistics</h1>
          <p className={styles.description}>
            Live platform metrics, user demographics, and economic ecosystem
            analysis.
          </p>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={() => dispatch(fetchAdminStatistics())}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </header>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Users</span>
            <div
              className={styles.iconWrapper}
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
              }}
            >
              <FiUsers />
            </div>
          </div>
          <span className={styles.kpiValue}>{kpi.totalUsers || 0}</span>
          <span className={styles.kpiSubtext}>
            Models: <b>{kpi.totalModels || 0}</b> | Agencies:{' '}
            <b>{kpi.totalAgencies || 0}</b>
          </span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Active Castings</span>
            <div
              className={styles.iconWrapper}
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
              }}
            >
              <FiBriefcase />
            </div>
          </div>
          <span className={styles.kpiValue}>{kpi.activeCastings || 0}</span>
          <span className={styles.kpiSubtext}>
            Currently looking for models
          </span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Connections</span>
            <div
              className={styles.iconWrapper}
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: '#f59e0b',
              }}
            >
              <FiActivity />
            </div>
          </div>
          <span className={styles.kpiValue}>{kpi.totalConnections || 0}</span>
          <span className={styles.kpiSubtext}>
            Applications & Invitations sent
          </span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Media Assets</span>
            <div
              className={styles.iconWrapper}
              style={{
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                color: '#ec4899',
              }}
            >
              <FiImage />
            </div>
          </div>
          <span className={styles.kpiValue}>
            {(content.totalPhotos || 0) + (content.totalAlbums || 0)}
          </span>
          <span className={styles.kpiSubtext}>
            Photos: <b>{content.totalPhotos || 0}</b> | Albums:{' '}
            <b>{content.totalAlbums || 0}</b>
          </span>
        </div>
      </div>

      {loading && !statistics?.kpi?.totalUsers ? (
        <div className={styles.loadingState}>Analyzing platform data...</div>
      ) : (
        <div className={styles.chartsGrid}>
          {/* CHART 1: Users by Status */}
          <div className={styles.chartBox}>
            <h3 className={styles.chartTitle}>Account Status Distribution</h3>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={usersStatusData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#e2e8f0'
                  />
                  <XAxis
                    dataKey='name'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType='circle'
                    wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
                  />
                  <Bar
                    dataKey='Models'
                    fill='#6366f1'
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                  <Bar
                    dataKey='Agencies'
                    fill='#ec4899'
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.chartBox}>
            <h3 className={styles.chartTitle}>Castings Economy</h3>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={castingsData}
                    cx='50%'
                    cy='50%'
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey='value'
                  >
                    {castingsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke='none'
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType='circle'
                    wrapperStyle={{ fontSize: '14px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.chartBox}>
            <h3 className={styles.chartTitle}>Job Engagement Actions</h3>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={engagementData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#e2e8f0'
                  />
                  <XAxis
                    dataKey='name'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType='circle' />
                  <Line
                    type='monotone'
                    dataKey='Applications'
                    stroke='#10b981'
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='Invitations'
                    stroke='#f59e0b'
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.chartBox}>
            <h3 className={styles.chartTitle}>Model Demographics (Gender)</h3>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx='50%'
                    cy='50%'
                    outerRadius={100}
                    dataKey='value'
                    label={({ name, percent }) =>
                      percent > 0
                        ? `${name} ${(percent * 100).toFixed(0)}%`
                        : ''
                    }
                    labelLine={false}
                  >
                    {genderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_GENDER[index % COLORS_GENDER.length]}
                        stroke='none'
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
