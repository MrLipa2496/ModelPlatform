import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchModelById } from '../../../store/slices/modelSlice';
import { fetchModelAlbums } from '../../../store/slices/albumSlice';
import ModelCard from '../../../components/ModelCard';
import AlbumCard from '../../../components/AlbumCard';
import styles from './ModelDetailsPage.module.sass';

export default function ModelDetailsPage () {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { selectedModel, loading: modelLoading } = useSelector(
    state => state.model
  );
  const { albums, loading: albumsLoading } = useSelector(state => state.album);

  useEffect(() => {
    if (id) {
      dispatch(fetchModelById(id));
      dispatch(fetchModelAlbums(id));
    }
  }, [dispatch, id]);

  if (modelLoading || !selectedModel) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.profilePage}>
      <ModelCard model={selectedModel} isEditable={false} />

      <div className={styles.albumsSection}>
        <h3 className={styles.sectionTitle}>Portfolio</h3>

        {albumsLoading ? (
          <p>Loading albums...</p>
        ) : albums && albums.length > 0 ? (
          <div className={styles.albumsList}>
            {albums.map(album => (
              <AlbumCard
                key={album.ALB_ID}
                album={album}
                modelId={id}
                isEditable={false}
              />
            ))}
          </div>
        ) : (
          <p className={styles.noAlbums}>No albums yet.</p>
        )}
      </div>
    </div>
  );
}
