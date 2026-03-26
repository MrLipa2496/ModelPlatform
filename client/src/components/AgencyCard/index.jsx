import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FiCamera,
  FiGlobe,
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiArrowLeft,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import styles from './AgencyCard.module.sass';
import defaultAvatarLocal from '../../../img/default-avatar.jpg';
import CONSTANTS from '../../utils/constants';

export default function AgencyCard ({
  agency,
  isEditable = false,
  onEdit,
  onLogoChange,
}) {
  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);
  const currentUserRole = (user?.role || user?.USR_Role || '').toLowerCase();
  const isAdmin = currentUserRole === 'admin';

  const {
    AGN_Logo,
    AGN_Name,
    AGN_Description,
    AGN_Country,
    AGN_City,
    AGN_Website,
    AGN_Phone,
    AGN_Verified,
    AGN_Status,
  } = agency;

  const handleLogoChange = e => {
    const file = e.target.files[0];
    if (file && onLogoChange) {
      onLogoChange(file);
    }
  };

  const handleContactClick = () => {
    toast.info('In-app messaging is coming soon!', {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: true,
      theme: 'dark',
    });
  };

  const handleAdminBack = () => {
    if (AGN_Status === 'pending') {
      navigate('/verify');
    } else {
      navigate('/users');
    }
  };

  const headerClass = `${styles.header} ${
    AGN_Verified ? styles.verifiedHeader : ''
  }`;

  return (
    <div className={styles.card}>
      <header className={headerClass}>
        <div className={styles.logoWrapper}>
          <img
            src={
              AGN_Logo ? `${CONSTANTS.BASE_URL}${AGN_Logo}` : defaultAvatarLocal
            }
            alt='Agency Logo'
            className={styles.logo}
          />
          {isEditable && (
            <label className={styles.uploadButton}>
              <FiCamera className={styles.icon} />
              <input
                type='file'
                accept='image/*'
                onChange={handleLogoChange}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>

        <div className={styles.titleGroup}>
          <h1 className={styles.name}>
            {AGN_Name}
            {AGN_Verified && <span className={styles.verifiedBadge}>✓</span>}
          </h1>
          <p className={styles.location}>
            {AGN_City || 'City'}, {AGN_Country || 'Country'}
          </p>
        </div>
      </header>

      <section className={styles.body}>
        <div className={styles.about}>
          <h4>About {AGN_Name}</h4>
          <p>{AGN_Description || 'No description provided yet.'}</p>
        </div>

        <div className={styles.contact}>
          <h4>Contact Info</h4>
          <ul>
            {AGN_Website && (
              <li>
                <FiGlobe className={styles.icon} />
                <a
                  href={
                    AGN_Website.startsWith('http')
                      ? AGN_Website
                      : `//${AGN_Website}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {AGN_Website.replace(/^https?:\/\//, '')}
                </a>
              </li>
            )}
            {AGN_Phone && (
              <li>
                <FiPhone className={styles.icon} />
                <span>{AGN_Phone}</span>
              </li>
            )}
            {agency.User && (
              <li>
                <FiMail className={styles.icon} />
                <span>{agency.User.USR_Email}</span>
              </li>
            )}
          </ul>

          {isAdmin ? (
            <button className={styles.adminBackBtn} onClick={handleAdminBack}>
              <FiArrowLeft className={styles.btnIcon} />
              Back to Moderation
            </button>
          ) : isEditable ? (
            <button className={styles.editButton} onClick={onEdit}>
              Edit Profile
            </button>
          ) : (
            <button className={styles.contactBtn} onClick={handleContactClick}>
              <FiMessageSquare className={styles.btnIcon} />
              Message Agency
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
