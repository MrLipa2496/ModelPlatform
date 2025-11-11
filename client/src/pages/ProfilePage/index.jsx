import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfile,
  saveProfile,
  uploadPhoto,
} from '../../store/slices/modelSlice';
import {
  fetchAgencyProfile,
  saveAgencyProfile,
  uploadAgencyLogo,
} from '../../store/slices/agencySlice';
import { fetchModelAlbums } from '../../store/slices/albumSlice';
import { fetchMyCastings } from '../../store/slices/castingSlice';

import ModelCard from '../../components/ModelCard';
import AgencyCard from '../../components/AgencyCard';
import AlbumCard from '../../components/AlbumCard';
import ModalWindow from '../../components/ModalWindow';

import {
  profileValidationSchema,
  agencyProfileValidationSchema,
} from '../../utils/validationSchema';
import CONSTANTS from '../../utils/constants';

import styles from './ProfilePage.module.sass';

export default function ProfilePage () {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const { data: model, loading: modelLoading } = useSelector(
    state => state.model
  );
  const { albums, loading: albumsLoading } = useSelector(state => state.album);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  const { data: agency, loading: agencyLoading } = useSelector(
    state => state.agency
  );

  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'model') {
      dispatch(fetchProfile());
    }
    if (user?.role === 'agency') {
      dispatch(fetchAgencyProfile());
    }
  }, [dispatch, user]);

  const modelId = model?.MOD_ID;
  useEffect(() => {
    if (user?.role === 'model' && modelId) {
      dispatch(fetchModelAlbums(modelId));
    }
    if (user?.role === 'agency') {
      dispatch(fetchMyCastings());
    }
  }, [dispatch, user, modelId]);

  const renderModelProfile = () => {
    if (modelLoading || !model) return <div>Loading Profile...</div>;

    return (
      <>
        <ModelCard
          model={model}
          isEditable={true}
          onEdit={() => setIsModelModalOpen(true)}
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
        {isModelModalOpen && (
          <ModalWindow
            model={model}
            fields={CONSTANTS.PROFILE_FIELDS}
            validationSchema={profileValidationSchema}
            onClose={() => setIsModelModalOpen(false)}
            onSubmit={values => dispatch(saveProfile(values))}
          />
        )}
      </>
    );
  };

  const renderAgencyProfile = () => {
    if (agencyLoading || !agency) return <div>Loading Profile...</div>;

    return (
      <>
        <AgencyCard
          agency={agency}
          isEditable={true}
          onEdit={() => setIsAgencyModalOpen(true)}
          onLogoChange={file => {
            const formData = new FormData();
            formData.append('logo', file);
            dispatch(uploadAgencyLogo(formData));
          }}
        />
        {isAgencyModalOpen && (
          <ModalWindow
            model={agency}
            fields={CONSTANTS.AGENCY_PROFILE_FIELDS}
            validationSchema={agencyProfileValidationSchema}
            onClose={() => setIsAgencyModalOpen(false)}
            onSubmit={values => dispatch(saveAgencyProfile(values))}
          />
        )}
      </>
    );
  };

  return (
    <div className={styles.profilePage}>
      {!user ? (
        <div>Loading user...</div>
      ) : user.role === 'model' ? (
        renderModelProfile()
      ) : user.role === 'agency' ? (
        renderAgencyProfile()
      ) : (
        <div>Unknown user role</div>
      )}
    </div>
  );
}
