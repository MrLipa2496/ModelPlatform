import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveProfile } from '../../store/slices/modelSlice';
import ModalWindow from '../ModalWindow';
import { FiEdit } from 'react-icons/fi';
import defaultAvatar from '../../../img/default-avatar.jpg';
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

  const handleChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    if (onPhotoChange) onPhotoChange(file);
  };

  const handleCardClick = () => {
    if (!isEditing) setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={styles.cardContainer}
      onClick={handleCardClick}
      title='Flip card'
    >
      <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''}`}>
        {/* FRONT */}
        <div className={`${styles.cardFront} ${styles.profileCard}`}>
          <div className={styles.photoWrapper}>
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
                  ? `http://localhost:5001${model.MOD_Photo}`
                  : defaultAvatar)
              }
              alt='Profile'
              className={styles.profilePhoto}
              onClick={e => {
                e.stopPropagation();
                if (isEditable) fileInputRef.current.click();
              }}
            />
          </div>

          <div className={styles.infoColumn}>
            <div className={styles.nameWrapper}>
              <span className={styles.fullName}>
                {model.MOD_FirstName?.toUpperCase()}{' '}
                {model.MOD_LastName?.toUpperCase()}
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
                  <span>
                    {field === 'MOD_BirthDate'
                      ? model[field]?.split('T')[0] || '-'
                      : model[field] || '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>

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

          <div className={styles.bioSection}>
            <h3>About</h3>
            <p>{model.MOD_Bio || '-'}</p>
          </div>
        </div>

        {/* BACK */}
        <div className={styles.cardBack}>
          {isEditable && isEditing ? (
            <ModalWindow
              model={model}
              fields={CONSTANTS.PROFILE_FIELDS}
              validationSchema={profileValidationSchema}
              inline
              onClose={() => setIsEditing(false)}
              onSubmit={values => dispatch(saveProfile(values))}
            />
          ) : isEditable && !isEditing ? (
            <p>Edit your profile by clicking the edit button</p>
          ) : (
            !isEditable && (
              <>
                <h2>Agency Actions</h2>
                <p>Select an action for this model:</p>
                <div className={styles.backButtons}>
                  <button className={styles.contactBtn}>Contact</button>
                  <button className={styles.portfolioBtn}>
                    Request Portfolio
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
