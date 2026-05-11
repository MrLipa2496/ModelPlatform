import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiShield,
  FiAlertTriangle,
  FiUserCheck,
  FiFileText,
  FiBriefcase,
} from 'react-icons/fi';
import styles from './TermsPage.module.sass';

export default function TermsPage () {
  const navigate = useNavigate();

  // Прокрутка страницы наверх при открытии
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: '01',
      icon: <FiShield />,
      title: 'Acceptance of Terms',
      content:
        'By accessing and using the LipaX platform, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must immediately discontinue your use of our services.',
    },
    {
      id: '02',
      icon: <FiUserCheck />,
      title: 'Eligibility & Registration',
      content:
        'Registration on the platform is strictly restricted to individuals who are at least 18 years of age. Models and Agencies are obligated to provide accurate, current, and complete information. LipaX reserves the right to request official documentation to verify identity or business legitimacy.',
    },
    {
      id: '03',
      icon: <FiFileText />,
      title: 'Verification & Moderation',
      content:
        'All newly registered accounts are subject to a mandatory "Pending" review stage. The LipaX administration retains the right to reject any application without providing a reason if the profile fails to meet our quality, aesthetic, or safety standards. All moderation decisions are final.',
    },
    {
      id: '04',
      icon: <FiAlertTriangle />,
      title: 'Code of Conduct',
      content:
        "Users are strictly prohibited from publishing content that contains explicit material, promotes violence, discrimination, or violates intellectual property rights. Spamming, fraudulent activities, or attempts to bypass the platform's communication/payment systems will result in immediate and permanent account termination.",
    },
    {
      id: '05',
      icon: <FiBriefcase />,
      title: 'Limitation of Liability',
      content:
        'LipaX operates solely as an intermediary platform connecting casting professionals with modeling talent. We bear no responsibility for the outcome of castings, the fulfillment of external contracts between users, or any direct/indirect damages arising from interactions initiated on this platform.',
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <FiArrowLeft className={styles.backIcon} /> Back
        </button>
        <div className={styles.titleWrapper}>
          <h1 className={styles.mainTitle}>
            Terms &<br />
            <span className={styles.outlinedText}>Conditions</span>
          </h1>
          <p className={styles.lastUpdated}>Last Updated: May 11, 2026</p>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.intro}>
          <p>
            Welcome to LipaX. These guidelines have been meticulously crafted to
            establish and maintain a secure, professional, and high-end
            environment for premier models and agencies across the globe.
          </p>
        </div>

        <div className={styles.sectionsList}>
          {sections.map(section => (
            <section key={section.id} className={styles.sectionRow}>
              <div className={styles.sectionLeft}>
                <div className={styles.sectionNumber}>{section.id}</div>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>{section.icon}</span>
                  <h2>{section.title}</h2>
                </div>
              </div>
              <div className={styles.sectionRight}>
                <p>{section.content}</p>
              </div>
            </section>
          ))}
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>
              Should you require any clarification regarding our platform rules,
              please do not hesitate to reach out to our dedicated support team.
            </p>
            <button
              className={styles.contactBtn}
              onClick={() => navigate('/contacts')}
            >
              Contact Support
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
