import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCastings } from '../../../store/slices/castingSlice';
import CastingCard from '../../../components/CastingCard';
import AuthModal from '../../../components/AuthModal';
import styles from './CastingsPage.module.sass';

export default function CastingsPage () {
  const dispatch = useDispatch();

  const { allCastings, loading } = useSelector(state => state.casting);
  const { user } = useSelector(state => state.auth);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalText, setModalText] = useState('');

  useEffect(() => {
    dispatch(fetchAllCastings());
  }, [dispatch]);

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
        {loading ? (
          <p className={styles.loadingText}>Loading castings...</p>
        ) : (
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
      </section>

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
