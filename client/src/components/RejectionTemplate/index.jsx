import React from 'react';
import styles from './../InviteTemplate/InviteTemplate.module.sass';
import CONSTANTS from '../../utils/constants';

export default function RejectionTemplate ({
  modelName,
  agency,
  casting,
  rejectionText,
}) {
  const agencyName = agency?.AGN_Name || 'LipaX Agency';
  const logoUrl = agency?.AGN_Logo
    ? `${CONSTANTS.BASE_URL}${agency.AGN_Logo}`
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

      <section className={styles.mainContent}>
        <h2
          className={styles.mainTitle}
          style={{ borderBottomColor: '#dc3545' }}
        >
          APPLICATION STATUS UPDATE
        </h2>

        <div
          style={{
            textAlign: 'right',
            fontSize: '0.9rem',
            color: '#555',
            marginBottom: '20px',
          }}
        >
          Date:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>

        <h3 className={styles.subTitle}>Dear {modelName},</h3>

        <p className={styles.bodyText}>
          Thank you for your interest in the project{' '}
          <strong>"{casting?.CST_Title}"</strong> and for taking the time to
          submit your application to {agencyName}.
        </p>

        <div
          className={styles.descriptionBox}
          style={{ borderLeftColor: '#dc3545' }}
        >
          <p>{rejectionText}</p>
        </div>

        <p className={styles.bodyText}>
          Please note that this decision is specific to this particular project
          and does not reflect on your potential for future opportunities. We
          have added your profile to our database and will not hesitate to
          contact you should a suitable role arise.
        </p>

        <p className={styles.bodyText}>
          We wish you the best of luck with your future endeavors.
        </p>
      </section>

      <footer className={styles.footer}>
        <p>This is an official notification from {agencyName}.</p>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} {agencyName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
