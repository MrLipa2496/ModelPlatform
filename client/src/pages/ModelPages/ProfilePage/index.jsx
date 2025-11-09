import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfile,
  saveProfile,
  uploadPhoto,
} from '../../../store/slices/modelSlice';
import { fetchModelAlbums } from '../../../store/slices/albumSlice';
import AlbumCard from '../../../components/AlbumCard';
import CONSTANTS from '../../../utils/constants';
import { profileValidationSchema } from '../../../utils/validationSchema';
import styles from './ProfilePage.module.sass';
import ModelCard from '../../../components/ModelCard';
import ModalWindow from '../../../components/ModalWindow';

export default function ProfilePage () {
  const dispatch = useDispatch();
  const { data: model, loading: modelLoading } = useSelector(
    state => state.model
  );
  const { albums, loading: albumsLoading } = useSelector(state => state.album);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const modelId = model?.MOD_ID;
  useEffect(() => {
    if (modelId) {
      dispatch(fetchModelAlbums(modelId));
    }
  }, [dispatch, modelId]);

  if (modelLoading || !model) return <div>Loading Profile...</div>;

  return (
    <div className={styles.profilePage}>
      <ModelCard
        model={model}
        isEditable={true}
        onEdit={() => setIsModalOpen(true)}
        onPhotoChange={file => dispatch(uploadPhoto(file))}
      />

      <div className={styles.albumsSection}>
        <h3>My Albums</h3>
        {albumsLoading ? (
          <div>Loading albums...</div>
        ) : (
          <div className={styles.albums}>
            {albums.map(album => (
              <AlbumCard key={album.ALB_ID} album={album} modelId={modelId} />
            ))}
            <AlbumCard isAddNew={true} modelId={modelId} />
          </div>
        )}
      </div>

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
