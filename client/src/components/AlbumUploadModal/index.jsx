import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  deleteAlbum,
  updateAlbumDetails,
  deleteAlbumPhotos,
  uploadAlbumPhotos,
} from '../../store/slices/albumSlice';
import styles from './AlbumUploadModal.module.sass';
import defaultPhoto from '../../../img/defaultPhotoBG.jpg';
import CONSTANTS from '../../utils/constants';

const PhotoUrl = ({ url, alt = 'album photo', className = '' }) => {
  const [src, setSrc] = useState(
    url ? `${CONSTANTS.BASE_URL}${url}` : defaultPhoto
  );

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (src !== defaultPhoto) {
          setSrc(defaultPhoto);
        }
      }}
    />
  );
};

const createInitialSlots = album => {
  const initialSlots = new Array(10).fill(null);
  if (album?.Photos) {
    album.Photos.forEach((photo, index) => {
      if (index < 10) {
        initialSlots[index] = { type: 'existing', data: photo };
      }
    });
  }
  return initialSlots;
};

export default function AlbumUploadModal ({
  isCreateMode = false,
  onClose,
  onCreate,
  onPreview,
  album,
  modelId,
}) {
  const dispatch = useDispatch();

  const [slots, setSlots] = useState(() => createInitialSlots(album));
  const [title, setTitle] = useState(album?.ALB_Title || '');
  const [description, setDescription] = useState(album?.ALB_Description || '');
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const handleAddNewPhoto = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isCreateMode) {
      setSlots(prevSlots => {
        const newSlots = [...prevSlots];
        newSlots[idx] = { type: 'new', data: file };
        return newSlots;
      });
    } else {
      dispatch(uploadAlbumPhotos({ albumId: album.ALB_ID, files: [file] }));
    }
  };

  const handleReplacePhoto = (e, idx, oldPhotoId) => {
    const file = e.target.files[0];
    if (!file) return;

    dispatch(
      deleteAlbumPhotos({ albumId: album.ALB_ID, photoIds: [oldPhotoId] })
    );
    dispatch(uploadAlbumPhotos({ albumId: album.ALB_ID, files: [file] }));
  };

  const handleDeletePhoto = (e, idx, photoId) => {
    e.preventDefault();
    if (isCreateMode) {
      setSlots(prevSlots => {
        const newSlots = [...prevSlots];
        newSlots[idx] = null;
        return newSlots;
      });
    } else {
      dispatch(
        deleteAlbumPhotos({ albumId: album.ALB_ID, photoIds: [photoId] })
      );
    }
  };

  const handleSaveChanges = async () => {
    if (isCreateMode) {
      const newFiles = slots
        .filter(slot => slot?.type === 'new')
        .map(slot => slot.data);
      if (!title || title.trim() === '') {
        console.error('Title is required');
        return;
      }
      onCreate && onCreate({ title, description }, newFiles);
    } else {
      if (
        title !== album.ALB_Title ||
        (description || '') !== (album.ALB_Description || '')
      ) {
        await dispatch(
          updateAlbumDetails({
            albumId: album.ALB_ID,
            title,
            description,
          })
        );
      }
      onClose();
    }
  };

  const handleDeleteAlbumClick = () => {
    setIsConfirmDelete(true);
  };

  const handleConfirmDeleteAlbum = async () => {
    await dispatch(deleteAlbum({ albumId: album.ALB_ID, modelId }));
    setIsConfirmDelete(false);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3>
          {isCreateMode ? 'Create new album' : `Edit: ${album?.ALB_Title}`}
        </h3>

        <div className={styles.formRow}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='Album title'
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder='Description (optional)'
          />
        </div>

        <h4 className={styles.subHeader}>Photos (max 10)</h4>
        <div className={styles.grid}>
          {slots.map((slot, i) => (
            <div className={styles.slot} key={i}>
              {slot === null && (
                <label htmlFor={`file-add-${i}`} className={styles.plusLabel}>
                  <span className={styles.plus}>+</span>
                </label>
              )}

              {slot?.type === 'existing' && (
                <>
                  <PhotoUrl url={slot.data.PH_Url} alt={slot.data.PH_Title} />
                  <div className={styles.slotOverlay}>
                    <label
                      htmlFor={`file-replace-${i}`}
                      className={`${styles.overlayBtn} ${styles.overlayBtnReplace}`}
                    >
                      Replace
                    </label>
                    <button
                      type='button'
                      className={`${styles.overlayBtn} ${styles.overlayBtnDelete}`}
                      onClick={e => handleDeletePhoto(e, i, slot.data.PH_ID)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}

              {slot?.type === 'new' && (
                <>
                  <img
                    src={URL.createObjectURL(slot.data)}
                    alt={`preview-${i}`}
                  />
                  <button
                    className={styles.removeSlotBtn}
                    onClick={e => handleDeletePhoto(e, i, null)}
                  >
                    ✕
                  </button>
                </>
              )}

              <input
                id={`file-add-${i}`}
                type='file'
                accept='image/*'
                className={styles.hiddenFileInput}
                onClick={e => (e.target.value = null)}
                onChange={e => handleAddNewPhoto(e, i)}
              />
              <input
                id={`file-replace-${i}`}
                type='file'
                accept='image/*'
                className={styles.hiddenFileInput}
                onClick={e => (e.target.value = null)}
                onChange={e => handleReplacePhoto(e, i, slot?.data?.PH_ID)}
              />
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          {!isCreateMode && (
            <>
              <button
                className={styles.deleteBtn}
                onClick={handleDeleteAlbumClick}
              >
                Delete Album
              </button>
              <button className={styles.previewBtn} onClick={onPreview}>
                Preview
              </button>
            </>
          )}

          <div style={{ flexGrow: 1 }} />

          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.confirmBtn} onClick={handleSaveChanges}>
            {isCreateMode ? 'Create Album' : 'Save Changes'}
          </button>
        </div>

        {isConfirmDelete && (
          <div className={styles.confirmOverlayInside}>
            <div className={styles.confirmModal}>
              <h4>Delete album?</h4>
              <p>
                Are you sure you want to delete "{album?.ALB_Title || title}"?
              </p>
              <div className={styles.confirmActions}>
                <button onClick={() => setIsConfirmDelete(false)}>
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteAlbum}
                  className={styles.confirmDeleteBtn}
                >
                  Yes, delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
