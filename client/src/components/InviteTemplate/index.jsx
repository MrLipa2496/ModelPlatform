import styles from './InviteTemplate.module.sass';
import CONSTANTS from '../../utils/constants';

export default function InviteTemplate ({
  modelName,
  agency,
  casting,
  invitationText,
}) {
  const formatAddress = (city, type) => {
    if (type === 'remote') return 'Remote Work';
    return city || 'Location TBA';
  };

  const formatPayment = payment => {
    if (!payment || payment === '0.00') return 'Negotiable';
    return `$${payment}`;
  };

  const formatDateRange = (start, end) => {
    if (!start) return 'To Be Announced';
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const startDate = new Date(start).toLocaleDateString('en-US', options);

    if (end) {
      const endDate = new Date(end).toLocaleDateString('en-US', options);
      return `${startDate} – ${endDate}`;
    }
    return startDate;
  };

  const formatRequirement = (min, max, unit) => {
    if (min && max) return `${min} - ${max} ${unit}`;
    if (min) return `${min}+ ${unit}`;
    if (max) return `Up to ${max} ${unit}`;
    return 'Any';
  };

  const agencyName = agency?.AGN_Name || 'LipaX Agency';
  const logoUrl = agency?.AGN_Logo
    ? `${CONSTANTS.BASE_URL}${agency.AGN_Logo}`
    : null;

  const coverImageUrl = casting?.CST_CoverImage
    ? `${CONSTANTS.BASE_URL}${casting.CST_CoverImage}`
    : null;

  return (
    <div className={styles.document}>
      <header className={styles.header}>
        {logoUrl ? (
          <img src={logoUrl} alt={agencyName} className={styles.logo} />
        ) : (
          <div className={styles.headerLogo}>{agencyName}</div>
        )}
      </header>

      {coverImageUrl && (
        <div className={styles.coverImageContainer}>
          <img
            src={coverImageUrl}
            alt={casting.CST_Title}
            className={styles.coverImage}
          />
        </div>
      )}

      <section className={styles.mainContent}>
        <h2 className={styles.mainTitle}>OFFICIAL CASTING INVITATION</h2>
        <h3 className={styles.subTitle}>Dear {modelName},</h3>

        <p className={styles.bodyText}>
          {invitationText ||
            `We are thrilled to inform you that your application for the casting "${casting.CST_Title}" has been successful! We believe your profile perfectly matches the requirements for this project.`}
        </p>

        {casting.CST_Description && (
          <div className={styles.descriptionBox}>
            <h4 className={styles.miniTitle}>Project Description:</h4>
            <p>{casting.CST_Description}</p>
          </div>
        )}

        <p className={styles.bodyText}>
          Please review the details below and confirm your participation via the
          button below.
        </p>

        <div className={styles.detailsBlock}>
          <h4 className={styles.blockTitle}>Casting Details:</h4>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Project:</span>
            <span className={styles.detailValue}>{casting.CST_Title}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Dates:</span>
            <span className={styles.detailValue}>
              {formatDateRange(casting.CST_StartDate, casting.CST_EndDate)}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Location:</span>
            <span className={styles.detailValue}>
              {formatAddress(casting.CST_City, casting.CST_LocationType)}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Compensation:</span>
            <span className={styles.detailValue}>
              {formatPayment(casting.CST_Payment)}
            </span>
          </div>
        </div>

        <div className={styles.requirementsBlock}>
          <h4 className={styles.blockTitle}>Role Requirements:</h4>
          <div className={styles.reqGrid}>
            <div className={styles.reqItem}>
              <span>Gender:</span>{' '}
              <strong>{casting.CST_Gender || 'Any'}</strong>
            </div>
            <div className={styles.reqItem}>
              <span>Age:</span>{' '}
              <strong>
                {formatRequirement(casting.CST_AgeMin, casting.CST_AgeMax, '')}
              </strong>
            </div>
            <div className={styles.reqItem}>
              <span>Height:</span>{' '}
              <strong>
                {formatRequirement(
                  casting.CST_HeightMin,
                  casting.CST_HeightMax,
                  'cm'
                )}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          This is a confidential invitation from {agencyName}. Please confirm
          your contact information to receive scheduling details.
        </p>
        <div className={styles.copyright}>
          © 2025 {agencyName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
