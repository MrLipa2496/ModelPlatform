import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAgencies } from '../../../store/slices/agencySlice';
import Pagination from '../../../components/Pagination';
import AuthModal from '../../../components/AuthModal';
import styles from './AgenciesPage.module.sass';
import CONSTANTS from '../../../utils/constants';

export default function AgenciesPage () {
  const dispatch = useDispatch();

  const { allAgencies, loading, totalPages, currentPage } = useSelector(
    state => state.agency
  );
  const { user } = useSelector(state => state.auth);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllAgencies({ page: 1, limit: CONSTANTS.PAGINATION_LIMIT }));
  }, [dispatch]);

  const handlePageChange = pageNumber => {
    if (pageNumber === currentPage) return;
    dispatch(
      fetchAllAgencies({ page: pageNumber, limit: CONSTANTS.PAGINATION_LIMIT })
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCollaborate = agency => {
    if (!user) {
      setShowModal(true);
      return;
    }
    window.location.href = `/agency/${agency.AGN_ID}`;
  };

  return (
    <div className={styles.agenciesPage}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Agencies & Brands</h1>
        <p className={styles.heroSubtitle}>
          You’ll have the opportunity to collaborate with leading modeling
          agencies, creative studios, and global brands. Together they help
          models build careers, create impactful campaigns, and open new doors
          in the worlds of fashion, advertising, and art.
        </p>
      </section>

      <section className={styles.agencyList}>
        {loading && (!allAgencies || allAgencies.length === 0) ? (
          <p className={styles.loadingText}>Loading...</p>
        ) : (
          Array.isArray(allAgencies) &&
          allAgencies.map(agency => (
            <div key={agency.AGN_ID} className={styles.agencyCard}>
              <div className={styles.logoWrapper}>
                <img
                  src={
                    agency.AGN_Logo
                      ? `http://localhost:5001${agency.AGN_Logo}`
                      : '/placeholder-agency.png'
                  }
                  alt={agency.AGN_Name}
                  className={styles.logo}
                />
              </div>
              <h3 className={styles.agencyName}>{agency.AGN_Name}</h3>
              <button
                className={styles.collaborateButton}
                onClick={() => handleCollaborate(agency)}
              >
                Collaborate
              </button>
            </div>
          ))
        )}

        {!loading && allAgencies.length === 0 && (
          <p className={styles.noData}>No agencies found.</p>
        )}
      </section>

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title='Create an Account'
        signupPath='/signup'
      >
        <p>
          Sign up or log in to view agency details, contact information, and
          collaboration opportunities.
        </p>
      </AuthModal>
    </div>
  );
}
