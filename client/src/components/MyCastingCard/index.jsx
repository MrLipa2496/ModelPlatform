import React from 'react';
import {
  FaDollarSign,
  FaTag,
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaVenusMars,
  FaBirthdayCake,
  FaRulerVertical,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './MyCastingCard.module.sass';
import CONSTANTS from '../../utils/constants';

const getStatusTagClass = status => {
  switch (status) {
    case 'active':
      return styles.statusActive;
    case 'pending':
      return styles.statusPending;
    case 'closed':
      return styles.statusClosed;
    case 'rejected':
      return styles.statusRejected;
    default:
      return styles.statusDefault;
  }
};

const formatPayment = payment => {
  if (!payment || payment === '0.00') return 'Negotiable';
  return `$${payment}`;
};

const formatRange = (min, max, unit) => {
  if (min && max) return `${min} - ${max} ${unit}`;
  if (min) return `${min}+ ${unit}`;
  if (max) return `Up to ${max} ${unit}`;
  return 'Any';
};

const formatDate = date => {
  if (!date) return 'TBA';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const formatDateRange = (start, end) => {
  if (start && end) return `${formatDate(start)} - ${formatDate(end)}`;
  if (start) return `Starts: ${formatDate(start)}`;
  return 'Dates: TBA';
};

export default function MyCastingCard ({ casting, onEdit, onDelete }) {
  const navigate = useNavigate();
  const {
    CST_ID,
    CST_Title,
    CST_CoverImage,
    CST_Status,
    CST_Payment,
    CST_Type,
    CST_City,
    CST_LocationType,
    CST_StartDate,
    CST_EndDate,
    CST_Gender,
    CST_AgeMin,
    CST_AgeMax,
    CST_HeightMin,
    CST_HeightMax,
    Applications,
  } = casting;

  const applicantCount = Applications ? Applications.length : 0;

  const coverImage = CST_CoverImage
    ? `${CONSTANTS.BASE_URL}${CST_CoverImage}`
    : `https://placehold.co/600x400/eee/ccc?text=No+Image`;

  const locationText =
    CST_LocationType === 'remote' ? 'Remote' : CST_City || 'On-site';

  const dateRange = formatDateRange(CST_StartDate, CST_EndDate);
  const ageRange = formatRange(CST_AgeMin, CST_AgeMax, 'y.o.');
  const heightRange = formatRange(CST_HeightMin, CST_HeightMax, 'cm');

  const handleViewApplicants = e => {
    e.stopPropagation();
    navigate(`/applicants?casting=${CST_ID}`);
  };

  const handleEditClick = e => {
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = e => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={coverImage} alt={CST_Title} className={styles.image} />
        <span
          className={`${styles.statusTag} ${getStatusTagClass(CST_Status)}`}
        >
          {CST_Status}
        </span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{CST_Title}</h3>

        <div className={styles.applicantInfo}>
          <FaUsers className={styles.applicantIcon} />
          <span className={styles.applicantText}>
            {applicantCount} {applicantCount === 1 ? 'Applicant' : 'Applicants'}
          </span>
        </div>

        <hr className={styles.divider} />

        <div className={styles.dataGrid}>
          <div className={styles.dataItem}>
            <FaDollarSign className={styles.dataIcon} />
            <span className={styles.dataText}>
              {formatPayment(CST_Payment)}
            </span>
          </div>
          <div className={styles.dataItem}>
            <FaTag className={styles.dataIcon} />
            <span className={styles.dataText}>{CST_Type}</span>
          </div>
          <div className={styles.dataItem}>
            <FaMapMarkerAlt className={styles.dataIcon} />
            <span className={styles.dataText}>{locationText}</span>
          </div>
          <div className={styles.dataItem}>
            <FaCalendarAlt className={styles.dataIcon} />
            <span className={styles.dataText}>{dateRange}</span>
          </div>
          <div className={styles.dataItem}>
            <FaVenusMars className={styles.dataIcon} />
            <span className={styles.dataText}>{CST_Gender}</span>
          </div>
          <div className={styles.dataItem}>
            <FaBirthdayCake className={styles.dataIcon} />
            <span className={styles.dataText}>{ageRange}</span>
          </div>
          <div className={styles.dataItem}>
            <FaRulerVertical className={styles.dataIcon} />
            <span className={styles.dataText}>{heightRange}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleViewApplicants}
        >
          View Applicants
        </button>
        <button
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={handleEditClick}
        >
          Edit
        </button>
        <button
          className={`${styles.button} ${styles.buttonDanger}`}
          onClick={handleDeleteClick}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
