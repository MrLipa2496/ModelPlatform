import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications } from '../../../store/slices/applicationSlice';
import MyApplicationCard from '../../../components/MyApplicationCard';
import styles from './MyApplicationsPage.module.sass';
import { FaFolderOpen } from 'react-icons/fa'; // Іконка для порожнього стану

export default function MyApplicationsPage () {
  const dispatch = useDispatch();

  const { myApplications, loading, error } = useSelector(
    state => state.application
  );

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const renderContent = () => {
    if (loading) {
      return <div className={styles.loading}>Loading your applications...</div>;
    }
    if (error) {
      return <div className={styles.error}>Error: {error}</div>;
    }
    if (!myApplications || myApplications.length === 0) {
      return (
        <div className={styles.emptyState}>
          <FaFolderOpen className={styles.emptyIcon} />
          <h2>No Applications Yet</h2>
          <p>You haven't applied to any castings yet. Go find your next job!</p>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {myApplications.map(app => (
          <MyApplicationCard key={app.APP_ID} application={app} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Applications</h1>
        <p className={styles.subtitle}>
          Track the status of your casting applications.
        </p>
      </header>

      {renderContent()}
    </div>
  );
}
