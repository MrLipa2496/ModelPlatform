import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications } from '../../../store/slices/applicationSlice';
import MyApplicationCard from '../../../components/MyApplicationCard';
import Pagination from '../../../components/Pagination';
import styles from './MyApplicationsPage.module.sass';
import { FaFolderOpen } from 'react-icons/fa';
import CONSTANTS from '../../../utils/constants';

export default function MyApplicationsPage () {
  const dispatch = useDispatch();

  const { myApplications, loading, error, totalPages, currentPage } =
    useSelector(state => state.application);

  useEffect(() => {
    dispatch(
      fetchMyApplications({ page: 1, limit: CONSTANTS.PAGINATION_LIMIT })
    );
  }, [dispatch]);

  const handlePageChange = pageNumber => {
    if (pageNumber === currentPage) return;
    dispatch(
      fetchMyApplications({
        page: pageNumber,
        limit: CONSTANTS.PAGINATION_LIMIT,
      })
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (loading && (!myApplications || myApplications.length === 0)) {
      return <div className={styles.loading}>Loading your applications...</div>;
    }

    if (error) {
      return <div className={styles.error}>Error: {error}</div>;
    }

    if (!loading && (!myApplications || myApplications.length === 0)) {
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
        {Array.isArray(myApplications) &&
          myApplications.map(app => (
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

      {!loading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
