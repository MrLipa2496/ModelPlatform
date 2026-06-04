import React, { useState, useEffect, useCallback } from 'react';
import styles from './AlbumViewModal.module.sass';
import defaultPhoto from '../../../img/defaultPhotoBG.jpg';
import {
  FiEdit2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
} from 'react-icons/fi';
import CONSTANTS from '../../utils/constants';

const getPhotoSrc = url => (url ? `${CONSTANTS.BASE_URL}${url}` : defaultPhoto);

const formatTimeAgo = dateString => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1)
    return interval === 1 ? '1 year ago' : `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1)
    return interval === 1 ? '1 month ago' : `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1)
    return interval === 1 ? '1 day ago' : `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1)
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;

  return 'Just now';
};

export default function AlbumViewModal ({
  album,
  onClose,
  onEdit,
  isEditable = false,
}) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = index => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  }, []);

  const nextPhoto = useCallback(
    e => {
      e?.stopPropagation();
      setLightboxIndex(prev =>
        prev === album.Photos.length - 1 ? 0 : prev + 1
      );
    },
    [album?.Photos?.length]
  );

  const prevPhoto = useCallback(
    e => {
      e?.stopPropagation();
      setLightboxIndex(prev =>
        prev === 0 ? album.Photos.length - 1 : prev - 1
      );
    },
    [album?.Photos?.length]
  );

  useEffect(() => {
    const handleKeyDown = e => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextPhoto, prevPhoto]);

  if (!album) return null;

  const photos = album.Photos || [];

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h2>{album.ALB_Title}</h2>
              <div className={styles.metaInfo}>
                {photos.length} photos • Created{' '}
                {formatTimeAgo(album.createdAt)}
              </div>
              {album.ALB_Description && (
                <p className={styles.description}>{album.ALB_Description}</p>
              )}
            </div>

            <div className={styles.actions}>
              {isEditable && (
                <button className={styles.editBtn} onClick={onEdit}>
                  <FiEdit2 /> <span>Edit</span>
                </button>
              )}

              <button className={styles.closeBtn} onClick={onClose}>
                <FiX />
              </button>
            </div>
          </div>

          <div className={styles.contentArea}>
            {photos.length > 0 ? (
              <div className={styles.masonryGrid}>
                {photos.map((photo, index) => (
                  <div
                    key={photo.PH_ID}
                    className={styles.masonryItem}
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={getPhotoSrc(photo.PH_Url)}
                      alt='Portfolio'
                      loading='lazy'
                    />
                    <div className={styles.hoverOverlay}>
                      <FiMaximize2 className={styles.zoomIcon} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No photos in this album yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <button className={styles.lightboxCloseBtn} onClick={closeLightbox}>
            <FiX />
          </button>

          <button
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={prevPhoto}
          >
            <FiChevronLeft />
          </button>

          <div
            className={styles.lightboxContent}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={getPhotoSrc(photos[lightboxIndex].PH_Url)}
              alt='Fullscreen view'
              className={styles.fullImage}
            />
            <div className={styles.lightboxCounter}>
              {lightboxIndex + 1} / {photos.length}
            </div>
          </div>

          <button
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={nextPhoto}
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
