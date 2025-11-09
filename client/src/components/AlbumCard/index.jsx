import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAlbum, uploadAlbumPhotos } from '../../store/slices/albumSlice';
import AlbumUploadModal from '../AlbumUploadModal';
import styles from './AlbumCard.module.sass';
import defaultPhoto from '../../../img/defaultPhotoBG.jpg';

const API_BASE_URL = 'http://localhost:5001';

const PhotoUrl = ({ url, alt = 'album photo' }) => {
  const [src, setSrc] = useState(url ? `${API_BASE_URL}${url}` : defaultPhoto);

  return (
    <img
      src={src}
      alt={alt}
      onError={() => {
        if (src !== defaultPhoto) {
          setSrc(defaultPhoto);
        }
      }}
    />
  );
};

export default function AlbumCard ({ album, modelId, isAddNew = false }) {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateAlbum = async (values, files) => {
    const createAction = await dispatch(createAlbum({ modelId, values }));

    const newAlbumId = createAction.payload?.album?.ALB_ID;
    if (newAlbumId && files && files.length > 0) {
      await dispatch(uploadAlbumPhotos({ albumId: newAlbumId, files }));
    }
    setIsModalOpen(false);
  };

  const hasPhotos =
    album && Array.isArray(album.Photos) && album.Photos.length > 0;

  const preview = hasPhotos ? album.Photos.slice(0, 3) : [];
  const mainPhoto = preview[0];
  const sidePhotos = preview.slice(1);

  if (isAddNew) {
    return (
      <>
        <div
          className={`${styles.albumCard} ${styles.addNew}`}
          onClick={() => setIsModalOpen(true)}
        >
          <div className={styles.emptyAlbum}>
            <span className={styles.plus}>+</span>
            <div className={styles.label}>New album</div>
          </div>
        </div>

        {isModalOpen && (
          <AlbumUploadModal
            isCreateMode
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateAlbum}
            modelId={modelId}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={styles.albumCard}>
        <div
          className={styles.previewWrapper}
          onClick={() => setIsModalOpen(true)}
        >
          {!hasPhotos ? (
            <div className={styles.emptyAlbum}>
              <span className={styles.plus}>+</span>
              <div className={styles.label}>{album.ALB_Title}</div>
            </div>
          ) : (
            <div className={styles.photoGrid}>
              <div className={styles.mainPhoto}>
                <PhotoUrl url={mainPhoto?.PH_Url} alt={mainPhoto?.PH_ID} />
              </div>
              <div className={styles.sidePhotos}>
                <PhotoUrl
                  url={sidePhotos[0]?.PH_Url}
                  alt={sidePhotos[0]?.PH_ID}
                />
                <PhotoUrl
                  url={sidePhotos[1]?.PH_Url}
                  alt={sidePhotos[1]?.PH_ID}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <span className={styles.albumTitle}>{album.ALB_Title}</span>
        </div>
      </div>

      {isModalOpen && (
        <AlbumUploadModal
          album={album}
          modelId={modelId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
