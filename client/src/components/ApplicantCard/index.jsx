import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheck,
  FaTimes,
  FaRulerVertical,
  FaBirthdayCake,
} from 'react-icons/fa';
import styles from './ApplicantCard.module.sass';

// Хелпер для віку
const calculateAge = birthDate => {
  if (!birthDate) return 'N/A';
  const diff = Date.now() - new Date(birthDate).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default function ApplicantCard ({
  application,
  onAccept,
  onReject,
  showActions,
}) {
  const { Model } = application; // Всі дані про модель всередині

  if (!Model) {
    return <div className={styles.card}>Error: Model data missing.</div>;
  }

  const modelImage = Model.MOD_Photo
    ? `http://localhost:5001${Model.MOD_Photo}`
    : `https://placehold.co/300x400/eee/ccc?text=No+Photo`;

  return (
    <div className={styles.card}>
      <Link to={`/model/${Model.MOD_ID}`} className={styles.imageLink}>
        <img src={modelImage} alt='Model' className={styles.image} />
      </Link>

      <div className={styles.content}>
        <h3 className={styles.name}>
          {Model.MOD_FirstName} {Model.MOD_LastName}
        </h3>

        <div className={styles.details}>
          <span className={styles.detailItem}>
            <FaBirthdayCake className={styles.icon} />
            {calculateAge(Model.MOD_BirthDate)} y.o.
          </span>
          <span className={styles.detailItem}>
            <FaRulerVertical className={styles.icon} />
            {Model.MOD_Height || 'N/A'} cm
          </span>
        </div>

        <Link to={`/model/${Model.MOD_ID}`} className={styles.profileLink}>
          View Full Profile
        </Link>
      </div>

      {showActions && (
        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.buttonReject}`}
            onClick={onReject}
          >
            <FaTimes /> Reject
          </button>
          <button
            className={`${styles.button} ${styles.buttonAccept}`}
            onClick={onAccept}
          >
            <FaCheck /> Accept
          </button>
        </div>
      )}
    </div>
  );
}
