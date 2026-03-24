import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { saveProfile } from '../../store/slices/modelSlice';
import ModalWindow from '../ModalWindow';
import { FiEdit } from 'react-icons/fi';
import defaultAvatarLocal from '../../../img/default-avatar.jpg';
import styles from './ModelCard.module.sass';
import CONSTANTS from '../../utils/constants';
import { profileValidationSchema } from '../../utils/validationSchema';

export default function ModelCard ({
  model,
  isEditable = false,
  onPhotoChange,
}) {
  const dispatch = useDispatch();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isEditing]);

  const progressStats = useMemo(() => {
    const textFields = CONSTANTS.PROFILE_FIELDS;

    const filledTextCount = textFields.filter(field => {
      const value = model[field.name];
      return (
        value !== null && value !== undefined && value.toString().trim() !== ''
      );
    }).length;

    const hasPhoto =
      model.MOD_Photo &&
      model.MOD_Photo.trim() !== '' &&
      model.MOD_Photo !== defaultAvatarLocal;

    const totalItems = textFields.length + 1;
    const filledItems = filledTextCount + (hasPhoto ? 1 : 0);
    const percent = Math.round((filledItems / totalItems) * 100);

    return { percent, filled: filledItems, total: totalItems };
  }, [model]);

  const handleChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    if (onPhotoChange) onPhotoChange(file);
    e.target.value = null;
  };

  const handleCardClick = () => {
    if (!isEditing) setIsFlipped(!isFlipped);
  };

  const handlePhotoClick = e => {
    if (isEditable) {
      e.stopPropagation();
      fileInputRef.current.click();
    }
  };

  const handleCloseEditMode = () => {
    setIsEditing(false);
    setIsFlipped(false);
  };

  const formatFieldValue = (field, value) => {
    if (value === null || value === undefined || value === '') return '-';

    if (field === 'MOD_BirthDate') {
      return value.toString().split('T')[0];
    }

    if (field === 'MOD_Experience') {
      const exp = Number(value);
      return `${exp} year${exp === 1 ? '' : 's'}`;
    }

    if (field === 'MOD_Gender') {
      return (
        value.toString().charAt(0).toUpperCase() + value.toString().slice(1)
      );
    }

    return value;
  };

  const getStatusText = status => {
    switch (status) {
      case 'active':
        return 'Verified';
      case 'blocked':
        return 'Declined';
      case 'pending':
        return 'Pending';
      default:
        return 'Pending';
    }
  };

  const currentStatus = model.MOD_Status || 'pending';

  return (
    <>
      {isEditing && (
        <div className={styles.overlay} onClick={handleCloseEditMode} />
      )}

      <div
        className={`${styles.cardContainer} ${
          isEditing ? styles.modalActive : ''
        }`}
        onClick={handleCardClick}
        title={!isEditing ? 'Flip card' : ''}
      >
        <div
          className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''}`}
        >
          {/* --- FRONT --- */}
          <div className={`${styles.cardFront} ${styles.profileCard}`}>
            <div className={styles.photoWrapper} onClick={handlePhotoClick}>
              {isEditable && (
                <input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleChange}
                />
              )}
              <img
                src={
                  photoPreview ||
                  (model.MOD_Photo
                    ? `${CONSTANTS.BASE_URL}${model.MOD_Photo}`
                    : defaultAvatarLocal)
                }
                alt='Profile'
                className={styles.profilePhoto}
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatarLocal;
                }}
              />
            </div>

            <div className={styles.infoColumn}>
              <div className={styles.nameWrapper}>
                <span
                  className={`${styles.fullName} ${
                    currentStatus === 'active' ? styles.verifiedName : ''
                  }`}
                >
                  {model.MOD_FirstName?.toUpperCase()}{' '}
                  {model.MOD_LastName?.toUpperCase()}
                </span>

                <span
                  className={`${styles.statusBadge} ${styles[currentStatus]}`}
                >
                  {getStatusText(currentStatus)}
                </span>
              </div>

              <div className={styles.infoWrapper}>
                {[
                  'MOD_Gender',
                  'MOD_BirthDate',
                  'MOD_Height',
                  'MOD_Weight',
                  'MOD_EyeColor',
                  'MOD_HairColor',
                  'MOD_Experience',
                ].map(field => (
                  <div key={field} className={styles.infoRow}>
                    <span className={styles.infoLabel}>
                      {field.replace('MOD_', '')}:
                    </span>
                    <span>{formatFieldValue(field, model[field])}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.bioSection}>
              <h3>About</h3>
              <p>{model.MOD_Bio || '-'}</p>
            </div>
          </div>

          {/* --- BACK --- */}
          <div className={styles.cardBack}>
            {isEditable && isEditing ? (
              <div
                className={styles.formScrollContainer}
                onClick={e => e.stopPropagation()}
              >
                <ModalWindow
                  model={model}
                  fields={CONSTANTS.PROFILE_FIELDS}
                  validationSchema={profileValidationSchema}
                  inline
                  onClose={() => handleCloseEditMode()}
                  onSubmit={values => {
                    dispatch(saveProfile(values));
                    handleCloseEditMode();
                  }}
                />
              </div>
            ) : isEditable && !isEditing ? (
              <div className={styles.statsContainer}>
                <div
                  className={styles.progressCircle}
                  style={{
                    background: `conic-gradient(#000 ${progressStats.percent}%, #eee 0)`,
                  }}
                >
                  <div className={styles.innerCircle}>
                    <span className={styles.percentText}>
                      {progressStats.percent}%
                    </span>
                  </div>
                </div>

                <div className={styles.statsText}>
                  <h3>Profile Completion</h3>
                  <p>
                    {progressStats.filled} / {progressStats.total} fields filled
                  </p>
                </div>

                <button
                  className={styles.actionBtnStats}
                  onClick={e => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  {progressStats.percent === 100
                    ? 'Update Info'
                    : 'Complete Profile'}
                </button>
              </div>
            ) : (
              <>
                <h2>Agency Actions</h2>
                <p>Select an action for this model:</p>
                <div className={styles.backButtons}>
                  <button
                    className={styles.contactBtn}
                    onClick={e => e.stopPropagation()}
                  >
                    Contact
                  </button>
                  <button
                    className={styles.portfolioBtn}
                    onClick={e => e.stopPropagation()}
                  >
                    Request Portfolio
                  </button>
                </div>
              </>
            )}

            {isEditable && (
              <button
                className={styles.editBtn}
                onClick={e => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setIsFlipped(true);
                }}
              >
                <FiEdit />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
