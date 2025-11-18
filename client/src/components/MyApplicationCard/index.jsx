import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  downloadInvite,
  downloadRejection,
} from '../../store/slices/applicationSlice';
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
  FaExternalLinkAlt,
  FaFilePdf,
  FaEnvelopeOpen,
  FaSpinner,
} from 'react-icons/fa';
import styles from './MyApplicationCard.module.sass';

const getStatusInfo = status => {
  switch (status) {
    case 'accepted':
      return {
        text: 'Accepted',
        icon: FaCheckCircle,
        styleClass: styles.statusAccepted,
      };
    case 'rejected':
      return {
        text: 'Rejected',
        icon: FaTimesCircle,
        styleClass: styles.statusRejected,
      };
    case 'pending':
    default:
      return {
        text: 'Pending Review',
        icon: FaClock,
        styleClass: styles.statusPending,
      };
  }
};

const formatDate = dateString => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function MyApplicationCard ({ application }) {
  const dispatch = useDispatch();
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    APP_ID,
    Casting,
    APP_Status,
    createdAt,
    APP_RejectionReason,
    APP_InvitationText,
  } = application;

  if (!Casting) {
    return <div className={styles.card}>Casting info unavailable</div>;
  }

  const { Agency } = Casting;
  const statusInfo = getStatusInfo(APP_Status);
  const StatusIcon = statusInfo.icon;

  const coverImage = Casting.CST_CoverImage
    ? `http://localhost:5001${Casting.CST_CoverImage}`
    : `https://placehold.co/600x400/3498db/ffffff?text=${
        Casting.CST_Title.substring(0, 1) || 'C'
      }`;

  const handlePdfDownload = async () => {
    if (!APP_InvitationText) return;

    setIsDownloading(true);
    try {
      const fileName = `Invite_${
        Agency?.AGN_Name || 'Agency'
      }_${Casting.CST_Title.replace(/\s+/g, '_')}.pdf`;
      await dispatch(downloadInvite({ id: APP_ID, fileName })).unwrap();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download the invitation. Please try again later.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRejectionDownload = async () => {
    if (!APP_RejectionReason) return;

    setIsDownloading(true);
    try {
      const fileName = `Rejection_${
        Agency?.AGN_Name || 'Agency'
      }_${Casting.CST_Title.replace(/\s+/g, '_')}.pdf`;
      await dispatch(downloadRejection({ id: APP_ID, fileName })).unwrap();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download the rejection letter.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={coverImage}
          alt={Casting.CST_Title}
          className={styles.image}
        />
        <span className={`${styles.statusBadge} ${statusInfo.styleClass}`}>
          <StatusIcon className={styles.badgeIcon} /> {statusInfo.text}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{Casting.CST_Title}</h3>
          <span className={styles.date}>Applied: {formatDate(createdAt)}</span>
        </div>

        <div className={styles.agencyRow}>
          <FaBuilding className={styles.icon} />
          <span className={styles.agencyName}>
            Agency: {Agency ? Agency.AGN_Name : 'Unknown Agency'}
          </span>
        </div>

        {APP_Status === 'accepted' && APP_InvitationText && (
          <div className={styles.messageBox}>
            <FaEnvelopeOpen className={styles.messageIconAccepted} />
            <p className={styles.messageText}>
              You've been selected! Click the button below to download your
              official invitation.
            </p>
          </div>
        )}

        {APP_Status === 'rejected' && APP_RejectionReason && (
          <div className={styles.messageBox}>
            <div
              style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
            >
              <FaTimesCircle
                className={styles.messageIconRejected}
                style={{ marginTop: '3px' }}
              />
              <div>
                <p
                  className={styles.messageText}
                  style={{ marginBottom: '5px' }}
                >
                  Thank you for your interest. Unfortunately, your application
                  was not selected this time. Please download the official
                  letter below for more details
                </p>
                <p
                  className={styles.messageText}
                  style={{ fontSize: '0.9em', color: '#666' }}
                ></p>

                <button
                  onClick={handleRejectionDownload}
                  disabled={isDownloading}
                  className={styles.downloadLinkButton}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    textDecoration: 'underline',
                    cursor: isDownloading ? 'wait' : 'pointer',
                    padding: '5px 0',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: 'bold',
                  }}
                >
                  {isDownloading ? (
                    <FaSpinner className={styles.spinnerIcon} />
                  ) : (
                    <FaFilePdf />
                  )}
                  {isDownloading ? 'Loading...' : 'Download Official Letter'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.payment}>
            Payment:{' '}
            <span>
              {Casting.CST_Payment ? `$${Casting.CST_Payment}` : 'Negotiable'}
            </span>
          </div>

          {/* КНОПКИ В ФУТЕРІ */}
          {APP_Status === 'accepted' && APP_InvitationText ? (
            <button
              className={styles.downloadButton}
              onClick={handlePdfDownload}
              disabled={isDownloading}
              style={{
                opacity: isDownloading ? 0.7 : 1,
                cursor: isDownloading ? 'wait' : 'pointer',
              }}
            >
              {isDownloading ? (
                <>
                  <FaSpinner className={styles.spinnerIcon} /> Loading...
                </>
              ) : (
                <>
                  <FaFilePdf /> Download Invite
                </>
              )}
            </button>
          ) : (
            <Link
              to={`/myCastings/${Casting.CST_ID}`}
              className={styles.viewLink}
            >
              View Casting <FaExternalLinkAlt />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
