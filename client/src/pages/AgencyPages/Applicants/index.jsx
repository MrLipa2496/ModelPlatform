import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchApplicationsForCasting,
  respondToApplication,
  clearCastingApplications,
} from '../../../store/slices/applicationSlice';
import {
  fetchCastingById,
  clearSelectedCasting,
} from '../../../store/slices/castingSlice';
import ApplicantCard from '../../../components/ApplicantCard';
import styles from './Applicants.module.sass';

export default function Applicants () {
  const { castingId } = useParams();
  const dispatch = useDispatch();

  // 'pending', 'accepted', 'rejected'
  const [filter, setFilter] = useState('pending');

  const { castingApplications, loading, error } = useSelector(
    state => state.application
  );
  const { selectedCasting } = useSelector(state => state.casting);

  useEffect(() => {
    if (castingId) {
      dispatch(fetchApplicationsForCasting(castingId));
      dispatch(fetchCastingById(castingId));
    }
    return () => {
      dispatch(clearCastingApplications());
      dispatch(clearSelectedCasting());
    };
  }, [dispatch, castingId]);

  const filteredApps = useMemo(
    () => castingApplications.filter(app => app.APP_Status === filter),
    [castingApplications, filter]
  );

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
          No applications found for this status.
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
            showActions={filter === 'pending'}
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
        <h1 className={styles.title}>
          Applicants for: {selectedCasting?.CST_Title || '...'}
        </h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              filter === 'pending' ? styles.active : ''
            }`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`${styles.tab} ${
              filter === 'accepted' ? styles.active : ''
            }`}
            onClick={() => setFilter('accepted')}
          >
            Accepted
          </button>
          <button
            className={`${styles.tab} ${
              filter === 'rejected' ? styles.active : ''
            }`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </header>

      {renderContent()}
    </div>
  );
}
