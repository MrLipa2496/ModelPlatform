import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAlbum, uploadAlbumPhotos } from '../../store/slices/albumSlice';
import AlbumUploadModal from '../AlbumUploadModal';
import AlbumViewModal from '../AlbumViewModal/AlbumViewModal';
import styles from './AlbumCard.module.sass';
import defaultPhoto from '../../../img/defaultPhotoBG.jpg';

const API_BASE_URL = 'http://localhost:5001';

const PhotoUrl = ({ url, alt = 'album cover' }) => {
  const [src, setSrc] = useState(url ? `${API_BASE_URL}${url}` : defaultPhoto);
  return (
    <img
      src={src}
      alt={alt}
      className={styles.coverImage}
      onError={() => {
        if (src !== defaultPhoto) setSrc(defaultPhoto);
      }}
    />
  );
};

export default function AlbumCard ({
  album,
  modelId,
  isAddNew = false,
  isEditable = true,
}) {
  const dispatch = useDispatch();
  const [modalMode, setModalMode] = useState('none');

  const handleCreateAlbum = async (values, files) => {
    const createAction = await dispatch(createAlbum({ modelId, values }));
    const newAlbumId = createAction.payload?.album?.ALB_ID;

    if (newAlbumId && files && files.length > 0) {
      await dispatch(uploadAlbumPhotos({ albumId: newAlbumId, files }));
    }
    setModalMode('none');
  };

  const hasPhotos =
    album && Array.isArray(album.Photos) && album.Photos.length > 0;
  const coverPhoto = hasPhotos ? album.Photos[0] : null;

  if (isAddNew) {
    return (
      <>
        <div
          className={`${styles.albumCard} ${styles.addNew}`}
          onClick={() => setModalMode('create')}
        >
          <div className={styles.emptyContent}>
            <span className={styles.plus}>+</span>
            <div className={styles.label}>Create Album</div>
          </div>
        </div>

        {modalMode === 'create' && (
          <AlbumUploadModal
            isCreateMode
            onClose={() => setModalMode('none')}
            onCreate={handleCreateAlbum}
            modelId={modelId}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={styles.albumCard} onClick={() => setModalMode('view')}>
        <div className={styles.imageContainer}>
          {coverPhoto ? (
            <PhotoUrl url={coverPhoto.PH_Url} alt={album.ALB_Title} />
          ) : (
            <div className={styles.noPhotoPlaceholder}>
              <span>No Photos</span>
            </div>
          )}

          <div className={styles.cardOverlay}>
            <span className={styles.photoCount}>
              {album.Photos ? album.Photos.length : 0} items
            </span>
          </div>
        </div>

        <div className={styles.infoContainer}>
          <h4 className={styles.albumTitle}>{album.ALB_Title}</h4>
        </div>
      </div>

      {modalMode === 'view' && (
        <AlbumViewModal
          album={album}
          isEditable={isEditable}
          onClose={() => setModalMode('none')}
          onEdit={() => setModalMode('edit')}
        />
      )}

      {modalMode === 'edit' && (
        <AlbumUploadModal
          album={album}
          modelId={modelId}
          onClose={() => setModalMode('view')}
          onPreview={() => setModalMode('view')}
        />
      )}
    </>
  );
}
