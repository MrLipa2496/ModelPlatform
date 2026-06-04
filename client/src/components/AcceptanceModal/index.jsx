import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaCheckCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaFilePdf,
} from 'react-icons/fa';
import InviteTemplate from './../InviteTemplate';
import styles from './Modal.module.sass';

const formatAddress = (city, type) => {
  if (type === 'remote') return 'Remote Work';
  return city || 'Location TBA';
};

const formatPayment = payment => {
  if (!payment || payment === '0.00') return 'Negotiable';
  return `$${payment}`;
};

export default function AcceptanceModal ({
  isOpen,
  onClose,
  onConfirm,
  modelName,
  casting,
  agency,
}) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [invitationText, setInvitationText] = useState('');

  const defaultText = `We are thrilled to inform you that your application for the casting "${casting.CST_Title}" has been successful! We believe your profile perfectly matches the requirements for this project and would love to get in touch. Please confirm your contact information to receive scheduling details.`;

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
    onConfirm({
      invitationText: invitationText || defaultText,
    });
    onClose();
  };

  const modalClass = isPreviewing
    ? styles.modalContentLarge
    : styles.modalContent;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={modalClass} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <FaCheckCircle />{' '}
            {isPreviewing
              ? 'PDF Invitation Preview'
              : 'Accept & Request Contact'}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          {isPreviewing ? (
            <div className={styles.pdfViewer}>
              <InviteTemplate
                modelName={modelName}
                casting={casting}
                agency={agency}
                invitationText={invitationText || defaultText}
              />
            </div>
          ) : (
            <>
              <p className={styles.modalDescription}>
                Confirming acceptance will send the following personalized
                invitation to the model, requesting their email address for
                final scheduling.
              </p>

              <div className={styles.invitePreview}>
                <h4 className={styles.castingInfoTitle}>
                  Personalized Message:
                </h4>
                <textarea
                  className={styles.reasonTextarea}
                  defaultValue={defaultText}
                  onChange={e => setInvitationText(e.target.value)}
                  rows='5'
                  placeholder='Enter personalized message...'
                />
              </div>

              <h4 className={styles.castingInfoTitle}>Key Casting Details:</h4>
              <div className={styles.previewDetails}>
                <span className={styles.detailItem}>
                  <FaDollarSign className={styles.detailIcon} /> Payment:{' '}
                  <strong>{formatPayment(casting.CST_Payment)}</strong>
                </span>
                <span className={styles.detailItem}>
                  <FaCalendarAlt className={styles.detailIcon} /> Dates: TBD/See
                  full casting
                </span>
                <span className={styles.detailItem}>
                  <FaMapMarkerAlt className={styles.detailIcon} /> Location:{' '}
                  <strong>
                    {formatAddress(casting.CST_City, casting.CST_LocationType)}
                  </strong>
                </span>
              </div>
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.secondaryButton}
            onClick={() => setIsPreviewing(!isPreviewing)}
          >
            <FaFilePdf /> {isPreviewing ? 'Back to Edit' : 'Preview PDF'}
          </button>

          {!isPreviewing && (
            <button
              className={styles.confirmSuccessButton}
              onClick={handleConfirm}
            >
              Confirm Acceptance & Send Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
