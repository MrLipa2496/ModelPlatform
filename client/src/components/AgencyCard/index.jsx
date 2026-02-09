import { FaCamera, FaGlobe, FaPhone, FaEnvelope } from 'react-icons/fa';
import styles from './AgencyCard.module.sass';
import defaultAvatarLocal from '../../../img/default-avatar.jpg';

export default function AgencyCard ({
  agency,
  isEditable,
  onEdit,
  onLogoChange,
}) {
  const {
    AGN_Logo,
    AGN_Name,
    AGN_Description,
    AGN_Country,
    AGN_City,
    AGN_Website,
    AGN_Phone,
    AGN_Verified,
  } = agency;

  const handleLogoChange = e => {
    const file = e.target.files[0];
    if (file) {
      onLogoChange(file);
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
              AGN_Logo ? `http://localhost:5001${AGN_Logo}` : defaultAvatarLocal
            }
            alt='Agency Logo'
            className={styles.logo}
          />
          {isEditable && (
            <label className={styles.uploadButton}>
              <FaCamera className={styles.icon} />
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
            {AGN_City}, {AGN_Country}
          </p>
        </div>
      </header>

      <section className={styles.body}>
        <div className={styles.about}>
          <h4>About {AGN_Name}</h4>
          <p>{AGN_Description || 'No description provided.'}</p>
        </div>
        <div className={styles.contact}>
          <h4>Contact Info</h4>
          <ul>
            {AGN_Website && (
              <li>
                <FaGlobe className={styles.icon} />
                <a
                  href={
                    AGN_Website.startsWith('http')
                      ? AGN_Website
                      : `//${AGN_Website}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {AGN_Website}
                </a>
              </li>
            )}
            {AGN_Phone && (
              <li>
                <FaPhone className={styles.icon} />
                <span>{AGN_Phone}</span>
              </li>
            )}
            {agency.User && (
              <li>
                <FaEnvelope className={styles.icon} />
                <span>{agency.User.USR_Email}</span>
              </li>
            )}
          </ul>

          {isEditable && (
            <button className={styles.editButton} onClick={onEdit}>
              Edit Profile
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
