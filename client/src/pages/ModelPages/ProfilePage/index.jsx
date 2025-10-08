import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { FiEdit } from 'react-icons/fi';
import ValidatedField from '../../../components/ValidatedField';
import { profileValidationSchema } from '../../../utils/validationSchema';
import {
  fetchProfile,
  saveProfile,
  uploadPhoto,
} from '../../../store/slices/modelSlice';
import CONSTANTS from '../../../utils/constants';
import styles from './ProfilePage.module.sass';

export default function ProfilePage () {
  const dispatch = useDispatch();
  const { data: model, loading } = useSelector(state => state.model);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    dispatch(uploadPhoto(file));
  };

  const fileInputRef = React.useRef(null);

  if (loading || !model) return <div>Loading...</div>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <div className={styles.photoWrapper}>
          <input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
          <img
            src={
              photoPreview ||
              (model.MOD_Photo
                ? `http://localhost:5001${model.MOD_Photo}`
                : '/default-avatar.jpg')
            }
            alt='Profile Photo'
            onClick={() => fileInputRef.current.click()}
            className={styles.profilePhoto}
          />
        </div>

        <div className={styles.infoColumn}>
          <div className={styles.nameWrapper}>
            <span className={styles.fullName}>
              {model.MOD_FirstName.toUpperCase()}{' '}
              {model.MOD_LastName.toUpperCase()}
            </span>
          </div>

          <div className={styles.infoWrapper}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Gender:</span>
              <span>{model.MOD_Gender || '-'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Date of Birth:</span>
              <span>
                {model.MOD_BirthDate ? model.MOD_BirthDate.split('T')[0] : '-'}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Height:</span>
              <span>{model.MOD_Height || '-'} cm</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Weight:</span>
              <span>{model.MOD_Weight || '-'} kg</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Eye Color:</span>
              <span>{model.MOD_EyeColor || '-'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Hair Color:</span>
              <span>{model.MOD_HairColor || '-'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Experience:</span>
              <span>{model.MOD_Experience || '-'} year</span>
            </div>
          </div>
        </div>

        <button className={styles.editBtn} onClick={() => setIsModalOpen(true)}>
          <FiEdit />
        </button>
      </div>
      <div className={styles.bioSection}>
        <h3>About</h3>
        <p>{model.MOD_Bio || '-'}</p>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Edit Profile</h2>
            <Formik
              enableReinitialize
              initialValues={{
                MOD_FirstName: model.MOD_FirstName || '',
                MOD_LastName: model.MOD_LastName || '',
                MOD_Gender: model.MOD_Gender || '',
                MOD_BirthDate: model.MOD_BirthDate
                  ? model.MOD_BirthDate.split('T')[0]
                  : '',
                MOD_Height: model.MOD_Height || '',
                MOD_Weight: model.MOD_Weight || '',
                MOD_EyeColor: model.MOD_EyeColor || '',
                MOD_HairColor: model.MOD_HairColor || '',
                MOD_Experience: model.MOD_Experience || '',
                MOD_Bio: model.MOD_Bio || '',
              }}
              validationSchema={profileValidationSchema}
              onSubmit={values =>
                dispatch(saveProfile(values)).then(() => setIsModalOpen(false))
              }
            >
              {() => (
                <Form className={styles.profileForm}>
                  {CONSTANTS.PROFILE_FIELDS.map(field => (
                    <ValidatedField key={field.name} {...field} />
                  ))}

                  <div className={styles.modalButtons}>
                    <button type='submit' className={styles.saveBtn}>
                      💾 Save
                    </button>
                    <button
                      type='button'
                      onClick={() => setIsModalOpen(false)}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
