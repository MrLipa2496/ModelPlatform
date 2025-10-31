import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAgencies } from '../../../store/slices/agencySlice';
import styles from './AgenciesPage.module.sass';

export default function AgenciesPage () {
  const dispatch = useDispatch();
  const { allAgencies, loading } = useSelector(state => state.agency);
  const { user } = useSelector(state => state.auth);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllAgencies());
  }, [dispatch]);

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
        {loading ? (
          <p className={styles.loadingText}>Loading...</p>
        ) : (
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
      </section>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>Create an Account</h2>
            <p className={styles.modalText}>
              Sign up or log in to view agency details, contact information, and
              collaboration opportunities.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className={styles.signupButton}
                onClick={() => (window.location.href = '/signup')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
