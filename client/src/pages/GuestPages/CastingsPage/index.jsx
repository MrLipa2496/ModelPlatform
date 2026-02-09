import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCastings } from '../../../store/slices/castingSlice';
import CastingCard from '../../../components/CastingCard';
import Pagination from '../../../components/Pagination'; // 1. Импортируем компонент
import AuthModal from '../../../components/AuthModal';
import styles from './CastingsPage.module.sass';
import CONSTANTS from '../../../utils/constants';

export default function CastingsPage () {
  const dispatch = useDispatch();

  const { allCastings, loading, totalPages, currentPage } = useSelector(
    state => state.casting
  );
  const { user } = useSelector(state => state.auth);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalText, setModalText] = useState('');

  useEffect(() => {
    dispatch(fetchAllCastings({ page: 1, limit: CONSTANTS.PAGINATION_LIMIT }));
  }, [dispatch]);

  const handlePageChange = pageNumber => {
    if (pageNumber === currentPage) return;
    dispatch(
      fetchAllCastings({ page: pageNumber, limit: CONSTANTS.PAGINATION_LIMIT })
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = casting => {
    if (user && user.role === 'model') {
      window.location.href = `/castings/${casting.CST_ID}`;
      return;
    }

    if (!user) {
      setModalTitle('Sign Up to Apply');
      setModalText(
        'Create a model account to view details and apply for castings.'
      );
      setShowAuthModal(true);
      return;
    }

    if (user.role === 'agency' || user.role === 'admin') {
      setModalTitle('Action Blocked');
      setModalText(
        'Only models can apply for castings. You are currently logged in as an agency.'
      );
      setShowAuthModal(true);
      return;
    }
  };

  return (
    <div className={styles.castingsPage}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Open Castings</h1>
        <p className={styles.heroText}>
          Explore our catalog of current castings. Find your next job and
          collaborate with leading agencies.
        </p>
      </section>

      <section className={styles.castingsGrid}>
        {loading && (!allCastings || allCastings.length === 0) ? (
          <p className={styles.loadingText}>Loading castings...</p>
        ) : (
          Array.isArray(allCastings) &&
          allCastings.map(casting => {
            return (
              <CastingCard
                key={casting.CST_ID}
                casting={casting}
                onButtonClick={() => handleViewDetails(casting)}
              />
            );
          })
        )}

        {!loading && allCastings && allCastings.length === 0 && (
          <p className={styles.noData}>No active castings found.</p>
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
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={modalTitle}
        signupPath='/signup'
      >
        <p>{modalText}</p>
      </AuthModal>
    </div>
  );
}
