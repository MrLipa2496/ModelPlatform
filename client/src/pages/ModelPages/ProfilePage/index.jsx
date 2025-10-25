import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfile,
  saveProfile,
  uploadPhoto,
} from '../../../store/slices/modelSlice';
import CONSTANTS from '../../../utils/constants';
import { profileValidationSchema } from '../../../utils/validationSchema';
import styles from './ProfilePage.module.sass';
import ModelCard from '../../../components/ModelCard';
import ModalWindow from '../../../components/ModalWindow';

export default function ProfilePage () {
  const dispatch = useDispatch();
  const { data: model, loading } = useSelector(state => state.model);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading || !model) return <div>Loading...</div>;

  return (
    <div className={styles.profilePage}>
      <ModelCard
        model={model}
        isEditable={true}
        onEdit={() => setIsModalOpen(true)}
        onPhotoChange={file => dispatch(uploadPhoto(file))}
      />

      {isModalOpen && (
        <ModalWindow
          model={model}
          fields={CONSTANTS.PROFILE_FIELDS}
          validationSchema={profileValidationSchema}
          onClose={() => setIsModalOpen(false)}
          onSubmit={values => dispatch(saveProfile(values))}
        />
      )}
    </div>
  );
}
