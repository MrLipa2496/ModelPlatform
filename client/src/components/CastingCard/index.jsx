import React from 'react';
import styles from './CastingCard.module.sass';

const formatPayment = payment => {
  if (!payment || payment === '0.00') return 'Negotiable';
  return `$${payment}`;
};

const formatDate = date => {
  if (!date) return 'TBA';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const getInitial = name => name?.charAt(0)?.toUpperCase() || 'A';

export default function CastingCard ({ casting, onButtonClick }) {
  const {
    CST_Title,
    CST_Payment,
    CST_StartDate,
    CST_CoverImage,
    CST_Type,
    CST_City,
    CST_LocationType,
    Agency,
  } = casting;

  const coverImage = CST_CoverImage
    ? `http://localhost:5001${CST_CoverImage}`
    : `https://placehold.co/600x400/eee/ccc?text=Casting`;

  const agencyLogo = Agency?.AGN_Logo
    ? `http://localhost:5001${Agency.AGN_Logo}`
    : `https://placehold.co/40x40/eee/ccc?text=${getInitial(Agency?.AGN_Name)}`;

  const locationTag =
    CST_LocationType === 'remote' ? 'Remote' : CST_City || 'On-site';

  return (
    <div className={styles.card} onClick={onButtonClick}>
      <div className={styles.imageContainer}>
        <img
          src={coverImage}
          alt={CST_Title}
          className={styles.image}
          onError={e => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400/eee/ccc?text=Image+Not+Found`;
          }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.tagsContainer}>
          {CST_Type && <span className={styles.tagType}>{CST_Type}</span>}
          <span className={styles.tagLocation}>{locationTag}</span>
        </div>

        <h3 className={styles.title}>{CST_Title}</h3>

        <div className={styles.details}>
          <span className={styles.payment}>{formatPayment(CST_Payment)}</span>
          <span className={styles.date}>
            Starts: {formatDate(CST_StartDate)}
          </span>
        </div>

        <div className={styles.footer}>
          <div className={styles.agencyInfo}>
            <img
              src={agencyLogo}
              alt={Agency?.AGN_Name || 'Agency'}
              className={styles.agencyLogo}
              onError={e => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/40x40/eee/ccc?text=${getInitial(
                  Agency?.AGN_Name
                )}`;
              }}
            />
            <span className={styles.agencyName}>
              {Agency?.AGN_Name || 'Agency not specified'}
            </span>
          </div>
          <span className={styles.detailsLink}>View Details →</span>
        </div>
      </div>
    </div>
  );
}
