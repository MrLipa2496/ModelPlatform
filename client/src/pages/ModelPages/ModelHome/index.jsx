import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProfile } from '../../../store/slices/modelSlice';
import { fetchModelAlbums } from '../../../store/slices/albumSlice';
import { fetchMyApplications } from '../../../store/slices/applicationSlice';
import {
  FiBriefcase,
  FiUser,
  FiStar,
  FiAlertCircle,
  FiCheckCircle,
  FiUsers,
  FiInfo,
  FiMail,
  FiArrowRight,
  FiClock,
  FiXCircle,
  FiFileText,
} from 'react-icons/fi';
import defaultAvatarLocal from '../../../../img/default-avatar.jpg';
import styles from './ModelHome.module.sass';
import CONSTANTS from '../../../utils/constants';

export default function ModelHome () {
  const dispatch = useDispatch();
  const { data: profile, loading: profileLoading } = useSelector(
    state => state.model
  );
  const { albums } = useSelector(state => state.album);

  const { myApplications } = useSelector(state => state.application);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
    dispatch(fetchMyApplications({ page: 1, limit: 3 }));
  }, [dispatch, profile]);

  useEffect(() => {
    if (profile?.MOD_ID) {
      dispatch(fetchModelAlbums(profile.MOD_ID));
    }
  }, [dispatch, profile?.MOD_ID]);

  const carouselImages = useMemo(() => {
    let images = [];
    if (profile?.MOD_Photo) {
      images.push(`${CONSTANTS.BASE_URL}${profile.MOD_Photo}`);
    }
    if (albums && albums.length > 0) {
      const albumPhotos = albums.flatMap(album =>
        album.Photos
          ? album.Photos.map(photo => `${CONSTANTS.BASE_URL}${photo.PH_Url}`)
          : []
      );
      images.push(...albumPhotos);
    }
    if (images.length === 0) {
      images.push(defaultAvatarLocal);
    }
    return images;
  }, [profile, albums]);

  useEffect(() => {
    if (carouselImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % carouselImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [carouselImages.length]);

  const profileProgress = useMemo(() => {
    if (!profile) return { percent: 0, missing: [], filled: 0, total: 1 };

    const fields = CONSTANTS.PROFILE_FIELDS.map(f => f.name);
    let filledCount = 0;

    fields.forEach(field => {
      if (
        profile[field] !== null &&
        profile[field] !== undefined &&
        profile[field] !== ''
      ) {
        filledCount++;
      }
    });

    const hasPhoto = profile.MOD_Photo ? 1 : 0;
    const totalCount = fields.length + 1;
    const currentFilled = filledCount + hasPhoto;

    return {
      percent: Math.round((currentFilled / totalCount) * 100),
      isComplete: currentFilled === totalCount,
      filled: currentFilled,
      total: totalCount,
    };
  }, [profile]);

  if (profileLoading && !profile) {
    return <div className={styles.loader}>Loading dashboard...</div>;
  }

  const firstName = profile?.MOD_FirstName || 'MODEL';
  const lastName = profile?.MOD_LastName || '';
  const status = profile?.MOD_Status || 'pending';
  const rejectionReason =
    profile?.MOD_RejectionReason ||
    'No specific reason provided. Please contact support.';

  return (
    <div className={styles.dashboardContainer}>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.carousel}>
          {carouselImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt='Model presentation'
              className={`${styles.carouselImage} ${
                index === currentImageIndex ? styles.activeImage : ''
              }`}
            />
          ))}
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.welcomeTitle}>
            WELCOME BACK,{' '}
            <span
              className={`${styles.name} ${
                status === 'active' ? styles.verifiedName : ''
              }`}
            >
              {firstName.toUpperCase()} {lastName.toUpperCase()}
            </span>
          </h1>
          <div className={styles.statusRow}>
            <span className={`${styles.statusBadge} ${styles[status]}`}>
              {status.toUpperCase()}
            </span>
            {status === 'active' && (
              <FiCheckCircle className={styles.verifiedIcon} />
            )}
          </div>
        </div>
      </section>

      <div className={styles.dashboardContent}>
        {/* 2. OVERVIEW SECTION  */}
        <div className={styles.overviewGrid}>
          <div className={styles.widgetCard}>
            <h2 className={styles.sectionTitle}>Profile Setup</h2>
            <div className={styles.progressContent}>
              <div
                className={styles.progressCircle}
                style={{
                  background: `conic-gradient(#111 ${profileProgress.percent}%, #f0f0f0 0)`,
                }}
              >
                <div className={styles.innerCircle}>
                  <span className={styles.percentText}>
                    {profileProgress.percent}%
                  </span>
                </div>
              </div>
              <div className={styles.progressInfo}>
                <p className={styles.progressStats}>
                  <strong>{profileProgress.filled}</strong> of{' '}
                  <strong>{profileProgress.total}</strong> fields completed
                </p>
                <p className={styles.progressDesc}>
                  A complete profile is your best portfolio. Agencies filter
                  models by height, parameters, and experience.
                </p>
                {!profileProgress.isComplete ? (
                  <Link to='/profile' className={styles.primaryBtn}>
                    Complete Profile
                  </Link>
                ) : (
                  <span className={styles.successText}>
                    <FiCheckCircle /> Profile is fully optimized!
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.widgetCard}>
            <h2 className={styles.sectionTitle}>System Status</h2>
            <div className={styles.alertsWrapper}>
              {status === 'pending' ? (
                <div className={`${styles.alertBox} ${styles.warningAlert}`}>
                  <FiAlertCircle className={styles.alertIcon} />
                  <div>
                    <h3>Under Review</h3>
                    <p>
                      Your account is currently waiting for administrator
                      approval. You cannot apply to castings until verified.
                    </p>
                  </div>
                </div>
              ) : status === 'blocked' ? (
                <div className={`${styles.alertBox} ${styles.errorAlert}`}>
                  <FiAlertCircle className={styles.alertIcon} />
                  <div>
                    <h3>Account Declined</h3>
                    <p style={{ marginBottom: '8px' }}>
                      Your application was declined by the moderation team.
                    </p>
                    <div
                      style={{
                        background: 'rgba(255,0,0,0.05)',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        borderLeft: '3px solid #dc3545',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'flex-start',
                        marginTop: '8px',
                      }}
                    >
                      <FiFileText
                        style={{
                          color: '#dc3545',
                          marginTop: '3px',
                          flexShrink: 0,
                        }}
                      />
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          color: '#b02a37',
                          fontWeight: '500',
                        }}
                      >
                        {rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${styles.alertBox} ${styles.successAlert}`}>
                  <FiCheckCircle className={styles.alertIcon} />
                  <div>
                    <h3>Account Verified</h3>
                    <p>
                      You are visible to agencies and can freely apply to any
                      open castings. Good luck!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>
              <h2 className={styles.sectionTitle}>Recent Applications</h2>
              {myApplications && myApplications.length > 0 && (
                <Link to='/myApplications' className={styles.viewAllLink}>
                  View All
                </Link>
              )}
            </div>

            <div className={styles.applicationsList}>
              {myApplications && myApplications.length > 0 ? (
                myApplications.map(app => (
                  <div key={app.APP_ID} className={styles.appItem}>
                    <div className={styles.appInfo}>
                      <h4>{app.Casting?.CST_Title || 'Casting Position'}</h4>
                      <span className={styles.appDate}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div
                      className={`${styles.appStatusBadge} ${
                        styles[app.APP_Status?.toLowerCase()] || styles.pending
                      }`}
                    >
                      {app.APP_Status === 'pending' && <FiClock />}
                      {app.APP_Status === 'approved' && <FiCheckCircle />}
                      {app.APP_Status === 'rejected' && <FiXCircle />}
                      <span>{app.APP_Status || 'Pending'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyApps}>
                  <p>You haven't applied to any castings yet.</p>
                  <Link to='/castings' className={styles.primaryBtn}>
                    Find Castings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. OPPORTUNITIES  */}
        <section className={styles.opportunitiesSection}>
          <h2 className={styles.sectionTitle}>Manage Career</h2>
          <div className={styles.actionGrid}>
            <Link to='/castings' className={styles.actionCard}>
              <div className={styles.cardHeader}>
                <FiStar className={styles.cardIcon} />
                <h3>Castings</h3>
              </div>
              <p>
                Browse the latest job opportunities and submit your
                applications.
              </p>
              <div className={styles.cardFooter}>
                Explore <FiArrowRight />
              </div>
            </Link>

            <Link to='/myApplications' className={styles.actionCard}>
              <div className={styles.cardHeader}>
                <FiBriefcase className={styles.cardIcon} />
                <h3>Applications</h3>
              </div>
              <p>
                Track your submitted castings, agency offers, and interview
                statuses.
              </p>
              <div className={styles.cardFooter}>
                View tracking <FiArrowRight />
              </div>
            </Link>

            <Link to='/agencies' className={styles.actionCard}>
              <div className={styles.cardHeader}>
                <FiUsers className={styles.cardIcon} />
                <h3>Agencies</h3>
              </div>
              <p>
                Discover top modeling agencies and check their specific
                requirements.
              </p>
              <div className={styles.cardFooter}>
                View directory <FiArrowRight />
              </div>
            </Link>

            <Link to='/profile' className={styles.actionCard}>
              <div className={styles.cardHeader}>
                <FiUser className={styles.cardIcon} />
                <h3>Portfolio</h3>
              </div>
              <p>Manage your polaroids, albums, and physical measurements.</p>
              <div className={styles.cardFooter}>
                Edit portfolio <FiArrowRight />
              </div>
            </Link>
          </div>
        </section>

        {/* 4. PLATFORM RESOURCES*/}
        <section className={styles.resourcesSection}>
          <h2 className={styles.sectionTitle}>Resources</h2>
          <div className={styles.resourceGrid}>
            <Link to='/about' className={styles.resourceCard}>
              <FiInfo className={styles.resourceIcon} />
              <div className={styles.resourceText}>
                <h3>About LipaX</h3>
                <p>
                  Learn how our platform connects independent models with global
                  agencies.
                </p>
              </div>
            </Link>

            <Link to='/contacts' className={styles.resourceCard}>
              <FiMail className={styles.resourceIcon} />
              <div className={styles.resourceText}>
                <h3>Help & Support</h3>
                <p>
                  Need assistance? Contact our team for technical support or
                  general questions.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
