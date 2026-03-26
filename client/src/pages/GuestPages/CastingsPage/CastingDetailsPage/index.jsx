import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCastingById,
  clearSelectedCasting,
} from '../../../../store/slices/castingSlice';
import {
  createApplication,
  fetchMyApplications,
} from '../../../../store/slices/applicationSlice';
import { fetchProfile } from '../../../../store/slices/modelSlice';
import InfoModal from '../../../../components/InfoModal';
import styles from './CastingDetailsPage.module.sass';
import CONSTANTS from '../../../../utils/constants';

import {
  FaDollarSign,
  FaTag,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaVenusMars,
  FaBirthdayCake,
  FaRulerVertical,
  FaUserTie,
} from 'react-icons/fa';

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
    month: 'long',
    day: 'numeric',
  });
};

export default function CastingDetailsPage () {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const { user } = useSelector(state => state.auth);
  const { selectedCasting, loading: castingLoading } = useSelector(
    state => state.casting
  );
  const { myApplications, loading: appLoading } = useSelector(
    state => state.application
  );
  const { data: modelProfile } = useSelector(state => state.model);

  useEffect(() => {
    if (id) {
      dispatch(fetchCastingById(id));
      if (user?.role === 'model') {
        dispatch(fetchMyApplications());
        if (!modelProfile) {
          dispatch(fetchProfile());
        }
      }
    }
    return () => {
      dispatch(clearSelectedCasting());
    };
  }, [dispatch, id, user, modelProfile]);

  const applicationStatus = useMemo(() => {
    if (user?.role !== 'model' || !myApplications || !selectedCasting) {
      return null;
    }
    const app = myApplications.find(a => a.CST_ID === selectedCasting.CST_ID);
    return app ? app.APP_Status : null;
  }, [myApplications, selectedCasting, user]);

  const handleApplyClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (user.role === 'model') {
      const currentStatus = modelProfile?.MOD_Status || 'pending';

      if (currentStatus === 'pending') {
        setShowPendingModal(true);
        return;
      }

      if (!applicationStatus) {
        dispatch(createApplication({ CST_ID: id }));
      }
    }
  };

  const renderApplyButton = () => {
    if (!user) {
      return (
        <button className={styles.applyButton} onClick={handleApplyClick}>
          Login to Apply
        </button>
      );
    }

    if (user.role !== 'model') {
      return null;
    }

    if (appLoading) {
      return (
        <button className={styles.applyButton} disabled>
          Loading...
        </button>
      );
    }

    if (applicationStatus) {
      const statusText = {
        pending: 'Application Sent',
        accepted: 'Application Accepted!',
        rejected: 'Application Rejected',
      };
      const statusClass = {
        pending: styles.buttonPending,
        accepted: styles.buttonSuccess,
        rejected: styles.buttonDanger,
      };

      return (
        <button
          className={`${styles.applyButton} ${statusClass[applicationStatus]}`}
          disabled
        >
          {statusText[applicationStatus]}
        </button>
      );
    }

    return (
      <button className={styles.applyButton} onClick={handleApplyClick}>
        Apply Now
      </button>
    );
  };

  if (castingLoading || !selectedCasting) {
    return <div className={styles.loading}>Loading Casting...</div>;
  }

  const {
    CST_Title,
    CST_CoverImage,
    CST_Description,
    CST_Requirements,
    CST_Payment,
    CST_Type,
    CST_City,
    CST_Country,
    CST_LocationType,
    CST_StartDate,
    CST_EndDate,
    CST_Gender,
    CST_AgeMin,
    CST_AgeMax,
    CST_HeightMin,
    CST_HeightMax,
    Agency,
  } = selectedCasting;

  const locationText =
    CST_LocationType === 'remote' ? 'Remote' : `${CST_City}, ${CST_Country}`;
  return (
    <div className={styles.pageContainer}>
      <header
        className={styles.header}
        style={{
          backgroundImage: `url(${
            CST_CoverImage
              ? `${CONSTANTS.BASE_URL}${CST_CoverImage}`
              : `https://placehold.co/1200x400/eee/ccc?text=Casting`
          })`,
        }}
      >
        <div className={styles.headerOverlay}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{CST_Title}</h1>
          </div>
        </div>
      </header>

      <div className={styles.mainLayout}>
        <div className={styles.leftColumn}>
          <div className={styles.contentBlock}>
            <h2>Description</h2>
            <p>{CST_Description || 'No description provided.'}</p>
          </div>
          <div className={styles.contentBlock}>
            <h2>Requirements</h2>
            <p>{CST_Requirements || 'No specific requirements listed.'}</p>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.actionBox}>{renderApplyButton()}</div>

          <div className={styles.agencyBox}>
            <h4>Posted by</h4>
            <div className={styles.agencyInfo}>
              <img
                src={
                  Agency.AGN_Logo
                    ? `${CONSTANTS.BASE_URL}${Agency.AGN_Logo}`
                    : `https://placehold.co/50x50/eee/ccc?text=${Agency.AGN_Name.charAt(
                        0
                      )}`
                }
                alt={Agency.AGN_Name}
                className={styles.agencyLogo}
              />
              <span className={styles.agencyName}>{Agency.AGN_Name}</span>
            </div>
          </div>

          <div className={styles.detailsBox}>
            <h4>Key Details</h4>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <FaDollarSign />
                <div>
                  <span>Payment</span>
                  <strong>{formatPayment(CST_Payment)}</strong>
                </div>
              </div>
              <div className={styles.detailItem}>
                <FaTag />
                <div>
                  <span>Casting Type</span>
                  <strong>{CST_Type}</strong>
                </div>
              </div>
              <div className={styles.detailItem}>
                <FaMapMarkerAlt />
                <div>
                  <span>Location</span>
                  <strong>{locationText}</strong>
                </div>
              </div>
              <div className={styles.detailItem}>
                <FaCalendarAlt />
                <div>
                  <span>Dates</span>
                  <strong>
                    {formatDate(CST_StartDate)} - {formatDate(CST_EndDate)}
                  </strong>
                </div>
              </div>
              <div className={styles.detailItem}>
                <FaVenusMars />
                <div>
                  <span>Gender</span>
                  <strong>{CST_Gender}</strong>
                </div>
              </div>
              <div className={styles.detailItem}>
                <FaBirthdayCake />
                <div>
                  <span>Age Range</span>
                  <strong>{formatRange(CST_AgeMin, CST_AgeMax, 'y.o.')}</strong>
                </div>
              </div>
              <div className={styles.detailItem}>
                <FaRulerVertical />
                <div>
                  <span>Height Range</span>
                  <strong>
                    {formatRange(CST_HeightMin, CST_HeightMax, 'cm')}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InfoModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title='Login Required'
        signupPath='/signup'
        showSignupBtn={true}
      >
        <p>You must be logged in as a model to apply for castings.</p>
      </InfoModal>

      <InfoModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        title='Profile Under Review'
        showSignupBtn={false}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Your profile is currently being reviewed by our moderation team.
          </p>
          <p style={{ fontWeight: '600', color: '#111' }}>
            You will be able to apply for castings once your account is fully
            verified and activated.
          </p>
        </div>
      </InfoModal>
    </div>
  );
}
