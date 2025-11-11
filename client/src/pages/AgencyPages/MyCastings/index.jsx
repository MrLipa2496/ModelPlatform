import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMyCastings,
  deleteCasting,
  createCasting,
  updateCasting,
} from '../../../store/slices/castingSlice';
import { fetchAgencyProfile } from '../../../store/slices/agencySlice';
import MyCastingCard from '../../../components/MyCastingCard';
import ConfirmModal from '../../../components/AuthModal';
import CastingFormModal from '../../../components/CastingFormModal';
import styles from './MyCastings.module.sass';

export default function MyCastings () {
  const dispatch = useDispatch();
  const {
    myCastings,
    loading: castingsLoading,
    error,
  } = useSelector(state => state.casting);
  const { user } = useSelector(state => state.auth);

  const { data: agencyProfile, loading: agencyLoading } = useSelector(
    state => state.agency
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [castingToDelete, setCastingToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [castingToEdit, setCastingToEdit] = useState(null);
  const [formError, setFormError] = useState(null);

  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    if (user?.role === 'agency') {
      dispatch(fetchMyCastings());
      dispatch(fetchAgencyProfile());
    }
  }, [dispatch, user]);

  const handleCreate = () => {
    if (!agencyProfile?.AGN_Verified) {
      setShowVerifyModal(true);
      return;
    }

    setCastingToEdit(null);
    setFormError(null);
    setShowFormModal(true);
  };

  const handleEdit = casting => {
    setCastingToEdit(casting);
    setFormError(null);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (formData, castingId) => {
    try {
      setFormError(null);
      if (castingId) {
        await dispatch(
          updateCasting({ id: castingId, data: formData })
        ).unwrap();
      } else {
        await dispatch(createCasting(formData)).unwrap();
      }
      setShowFormModal(false);
    } catch (err) {
      console.error('Failed to submit form:', err);
      setFormError(err);
    }
  };

  const handleDeleteRequest = casting => {
    setCastingToDelete(casting);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (castingToDelete) {
      dispatch(deleteCasting(castingToDelete.CST_ID));
      setCastingToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleViewApplicants = casting => {
    console.log('Go to applicants for:', casting.CST_ID);
  };

  if (castingsLoading || agencyLoading) {
    return <div className={styles.loading}>Loading your castings...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  const isVerified = agencyProfile?.AGN_Verified;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Castings</h1>
        <button
          className={`${styles.createButton} ${
            !isVerified ? styles.buttonDisabled : ''
          }`}
          onClick={handleCreate}
          title={
            !isVerified
              ? 'Your account is pending verification'
              : 'Create new casting'
          }
        >
          + Create New Casting
        </button>
      </header>

      {myCastings.length === 0 ? (
        <p className={styles.emptyText}>
          You haven't created any castings yet.
        </p>
      ) : (
        <div className={styles.grid}>
          {myCastings.map(casting => (
            <MyCastingCard
              key={casting.CST_ID}
              casting={casting}
              onEdit={() => handleEdit(casting)}
              onDelete={() => handleDeleteRequest(casting)}
              onViewApplicants={() => handleViewApplicants(casting)}
            />
          ))}
        </div>
      )}

      <CastingFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        initialData={castingToEdit}
        formError={formError}
      />

      {showDeleteModal && (
        <ConfirmModal
          title='Delete Casting?'
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        >
          <p>
            Are you sure you want to delete "{castingToDelete?.CST_Title}"? This
            action cannot be undone.
          </p>
        </ConfirmModal>
      )}

      {showVerifyModal && (
        <ConfirmModal
          title='Account Not Verified'
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
        >
          <p>
            Your account is not verified. Please wait while we check your
            account, this may take up to 24 hours.
          </p>
        </ConfirmModal>
      )}
    </div>
  );
}
