import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchMyInvitations,
  respondToInvitation,
} from '../../../store/slices/invitationSlice';
import {
  FiCheck,
  FiX,
  FiClock,
  FiStar,
  FiArrowRight,
  FiInbox,
} from 'react-icons/fi';
import CONSTANTS from '../../../utils/constants';
import defaultAvatar from '../../../../img/default-avatar.jpg';
import styles from './ModelOffersPage.module.sass';

export default function ModelOffersPage () {
  const dispatch = useDispatch();
  const { myInvitations, loading } = useSelector(state => state.invitation);

  useEffect(() => {
    dispatch(fetchMyInvitations());
  }, [dispatch]);

  const handleRespond = (invitationId, status) => {
    dispatch(respondToInvitation({ id: invitationId, data: { status } }));
  };

  const getStatusBadge = status => {
    switch (status) {
      case 'accepted':
        return (
          <span className={`${styles.badge} ${styles.badgeAccepted}`}>
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className={`${styles.badge} ${styles.badgeRejected}`}>
            Declined
          </span>
        );
      case 'pending':
      default:
        return (
          <span className={`${styles.badge} ${styles.badgePending}`}>
            Pending Action
          </span>
        );
    }
  };

  const getCardStatusClass = status => {
    switch (status) {
      case 'accepted':
        return styles.cardAccepted;
      case 'rejected':
        return styles.cardRejected;
      default:
        return styles.cardPending;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Exclusive Offers</h1>
          <p className={styles.subtitle}>
            Direct casting invitations handpicked for you by top agencies.
          </p>
        </div>
      </header>

      {loading && myInvitations.length === 0 ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Unlocking your offers...</p>
        </div>
      ) : myInvitations.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <FiInbox className={styles.emptyIcon} />
          </div>
          <h2>Your inbox is waiting</h2>
          <p>
            Agencies haven't sent you direct offers yet. Keep your portfolio
            fresh and 100% complete to stand out!
          </p>
          <Link to='/model/profile' className={styles.emptyActionBtn}>
            Update Portfolio
          </Link>
        </div>
      ) : (
        <div className={styles.offersGrid}>
          {myInvitations.map((invite, index) => {
            const agency = invite.Agency || {};
            const casting = invite.Casting || {};
            const logoUrl = agency.AGN_Logo
              ? `${CONSTANTS.BASE_URL}${agency.AGN_Logo}`
              : defaultAvatar;

            return (
              <div
                key={invite.INV_ID}
                className={`${styles.offerCard} ${getCardStatusClass(
                  invite.INV_Status
                )}`}
                style={{ animationDelay: `${index * 0.05}s` }} // Каскадная анимация
              >
                <div className={styles.cardHeader}>
                  <div className={styles.agencyInfo}>
                    <div className={styles.logoRing}>
                      <img
                        src={logoUrl}
                        alt='Agency Logo'
                        className={styles.agencyLogo}
                      />
                    </div>
                    <div className={styles.agencyMeta}>
                      <Link
                        to={`/agency/${agency.AGN_ID}`}
                        className={styles.agencyName}
                      >
                        {agency.AGN_Name || 'Unknown Agency'}
                      </Link>
                      <p className={styles.date}>
                        <FiClock />{' '}
                        {new Date(invite.INV_SentAt).toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(invite.INV_Status)}
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.castingTitle}>
                    <FiStar className={styles.accentIcon} />
                    <span>{casting.CST_Title || 'Untitled Casting'}</span>
                  </h3>

                  <Link
                    to={`/castings/${casting.CST_ID}`}
                    className={styles.viewCastingBtn}
                  >
                    View full details{' '}
                    <FiArrowRight className={styles.arrowIcon} />
                  </Link>
                </div>

                {invite.INV_Status === 'pending' && (
                  <div className={styles.cardActions}>
                    <button
                      className={styles.acceptBtn}
                      onClick={() => handleRespond(invite.INV_ID, 'accepted')}
                    >
                      <FiCheck /> Accept Offer
                    </button>
                    <button
                      className={styles.rejectBtn}
                      onClick={() => handleRespond(invite.INV_ID, 'rejected')}
                    >
                      <FiX /> Pass
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
