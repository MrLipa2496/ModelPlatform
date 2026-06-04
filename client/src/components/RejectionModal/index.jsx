import React, { useState, useEffect } from 'react';
import { FaTimes, FaEnvelope, FaFilePdf } from 'react-icons/fa';
import RejectionTemplate from '../RejectionTemplate';
import styles from './../AcceptanceModal/Modal.module.sass';

export default function RejectionModal ({
  isOpen,
  onClose,
  onConfirm,
  draft,
  modelName,
  casting,
  agency,
}) {
  const [reason, setReason] = useState(draft);
  const [isPreviewing, setIsPreviewing] = useState(false);

  useEffect(() => {
    setReason(draft);
  }, [draft]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add(styles.modalOpenBody);
    } else {
      document.body.classList.remove(styles.modalOpenBody);
    }
    return () => {
      document.body.classList.remove(styles.modalOpenBody);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
    } else {
      alert('Please provide a rejection reason.');
    }
  };

  // Клас для ширини модалки
  const modalClass = isPreviewing
    ? styles.modalContentLarge
    : styles.modalContent;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={modalClass} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {isPreviewing ? (
              <>
                <FaFilePdf /> Rejection Letter Preview
              </>
            ) : (
              <>
                <FaEnvelope /> Reject Application
              </>
            )}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          {isPreviewing ? (
            // ПРЕВ'Ю
            <div className={styles.pdfViewer}>
              <RejectionTemplate
                modelName={modelName}
                casting={casting}
                agency={agency}
                rejectionText={reason}
              />
            </div>
          ) : (
            // ФОРМА РЕДАГУВАННЯ
            <>
              <p className={styles.modalDescription}>
                The following rejection reason was automatically generated based
                on the casting requirements. You can review and edit it before
                sending.
              </p>
              <textarea
                className={styles.reasonTextarea}
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows='10'
                placeholder='Enter the reason for rejection...'
              />
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.secondaryButton}
            onClick={() => setIsPreviewing(!isPreviewing)}
          >
            <FaFilePdf /> {isPreviewing ? 'Back to Edit' : 'Preview Letter'}
          </button>

          {!isPreviewing && (
            <button
              className={styles.confirmDangerButton}
              onClick={handleConfirm}
            >
              Send Rejection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
