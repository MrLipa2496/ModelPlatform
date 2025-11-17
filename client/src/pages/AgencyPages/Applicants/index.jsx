import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAgencyApplications,
  respondToApplication,
} from '../../../store/slices/applicationSlice';
import { fetchMyCastings } from '../../../store/slices/castingSlice';
import ApplicantCard from '../../../components/ApplicantCard';
import styles from './Applicants.module.sass';

const getInitialCastingFilter = location => {
  const params = new URLSearchParams(location.search);
  const castingIdFromUrl = params.get('casting');
  return castingIdFromUrl ? String(castingIdFromUrl) : 'all';
};

export default function Applicants () {
  const dispatch = useDispatch();
  const location = useLocation();

  const [statusFilter, setStatusFilter] = useState('pending');

  const [castingFilter, setCastingFilter] = useState(() =>
    getInitialCastingFilter(location)
  );

  const { agencyApplications, loading, error } = useSelector(
    state => state.application
  );
  const { myCastings } = useSelector(state => state.casting);

  useEffect(() => {
    dispatch(fetchAgencyApplications());
    dispatch(fetchMyCastings());
  }, [dispatch]);

  useEffect(() => {
    setCastingFilter(getInitialCastingFilter(location));
  }, [location.search]);

  const filteredApps = useMemo(() => {
    if (!Array.isArray(agencyApplications)) {
      return [];
    }
    return agencyApplications.filter(app => {
      const statusMatch = app.APP_Status === statusFilter;
      const castingMatch =
        castingFilter === 'all'
          ? true
          : app.CST_ID === parseInt(castingFilter, 10);
      return statusMatch && castingMatch;
    });
  }, [agencyApplications, statusFilter, castingFilter]);

  const pageTitle = useMemo(() => {
    if (castingFilter === 'all') {
      return 'All Applicants';
    }

    if (!Array.isArray(myCastings) || myCastings.length === 0) {
      return 'Loading Applicants...';
    }

    const castingId = parseInt(castingFilter, 10);
    const selectedCasting = myCastings.find(
      casting => casting.CST_ID === castingId
    );

    return selectedCasting
      ? `Applicants for: ${selectedCasting.CST_Title}`
      : 'All Applicants';
  }, [castingFilter, myCastings]);

  const handleAccept = applicationId => {
    dispatch(
      respondToApplication({ id: applicationId, data: { status: 'accepted' } })
    );
  };

  const handleReject = applicationId => {
    dispatch(
      respondToApplication({ id: applicationId, data: { status: 'rejected' } })
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className={styles.loading}>Loading applicants...</div>;
    }
    if (error) {
      return <div className={styles.error}>Error: {error}</div>;
    }
    if (filteredApps.length === 0) {
      return (
        <p className={styles.emptyText}>
          No applications found for the selected filters.
        </p>
      );
    }
    return (
      <div className={styles.grid}>
        {filteredApps.map(app => (
          <ApplicantCard
            key={app.APP_ID}
            application={app}
            onAccept={() => handleAccept(app.APP_ID)}
            onReject={() => handleReject(app.APP_ID)}
            showActions={statusFilter === 'pending'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to='/myCastings' className={styles.backLink}>
          ← Back to Castings
        </Link>

        <h1 className={styles.title}>{pageTitle}</h1>

        <div className={styles.filterContainer}>
          <label htmlFor='casting-filter' className={styles.filterLabel}>
            Filter by Casting:
          </label>
          <select
            id='casting-filter'
            value={castingFilter}
            onChange={e => setCastingFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value='all'>All Castings</option>
            {Array.isArray(myCastings) &&
              myCastings.map(casting => (
                <option key={casting.CST_ID} value={casting.CST_ID}>
                  {casting.CST_Title}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              statusFilter === 'pending' ? styles.active : ''
            }`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`${styles.tab} ${
              statusFilter === 'accepted' ? styles.active : ''
            }`}
            onClick={() => setStatusFilter('accepted')}
          >
            Accepted
          </button>
          <button
            className={`${styles.tab} ${
              statusFilter === 'rejected' ? styles.active : ''
            }`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </header>

      {renderContent()}
    </div>
  );
}
