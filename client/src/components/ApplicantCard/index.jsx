import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheck,
  FaTimes,
  FaRulerVertical,
  FaBirthdayCake,
  FaClipboardList,
  FaVenusMars,
  FaCheckCircle,
  FaTimesCircle,
  FaVial,
} from 'react-icons/fa';
import RejectionModal from '../RejectionModal';
import AcceptanceModal from '../AcceptanceModal';
import CONSTANTS from '../../utils/constants';
import styles from './ApplicantCard.module.sass';

const calculateAge = birthDate => {
  if (!birthDate) return 0;
  const diff = Date.now() - new Date(birthDate).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const generateRejectionDraft = (model, casting, matchResults) => {
  const mismatched = matchResults.filter(r => !r.match && r.req !== 'Any');
  const castingTitle = casting.CST_Title || 'the casting';

  if (mismatched.length === 0) {
    return `Dear ${model.MOD_FirstName},\n\nThank you for your application to ${castingTitle}. While your profile is strong, we have decided to move forward with other candidates at this time.\n\nWe wish you the best in your future endeavors.\n\nSincerely,\n[Your Agency Name]`;
  }

  const reasons = mismatched
    .map(item => {
      return `\t- ${item.label} requirement (${item.req} required) vs. your profile (${item.value}).`;
    })
    .join('\n');

  return `Dear ${model.MOD_FirstName},\n\nThank you for your application to ${castingTitle}. We carefully reviewed your profile, but found some differences regarding the required parameters:\n\n${reasons}\n\nWe appreciate your interest and wish you success in finding suitable projects.\n\nSincerely,\n[Your Agency Name]`;
};

export default function ApplicantCard ({ application, showActions, onRespond }) {
  const { Model, Casting } = application;

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [showMatch, setShowMatch] = useState(false);

  const matchResults = useMemo(() => {
    if (!Model || !Casting) return [];

    const modelAge = calculateAge(Model.MOD_BirthDate);

    const genderReqRaw = Casting.CST_Gender || 'Any';
    const modelGenderRaw = Model.MOD_Gender || '';
    const genderReqLower = genderReqRaw.toLowerCase();
    const modelGenderLower = modelGenderRaw.toLowerCase();

    const genderMatch =
      genderReqLower === 'any' ||
      !modelGenderLower ||
      genderReqLower === modelGenderLower;

    const ageMin = Casting.CST_AgeMin;
    const ageMax = Casting.CST_AgeMax;
    let ageReq = 'Any';
    if (ageMin && ageMax) ageReq = `${ageMin} - ${ageMax} y.o.`;
    else if (ageMin) ageReq = `${ageMin}+ y.o.`;
    else if (ageMax) ageReq = `Up to ${ageMax} y.o.`;
    const ageMatch =
      (!ageMin || modelAge >= ageMin) && (!ageMax || modelAge <= ageMax);

    const heightMin = Casting.CST_HeightMin;
    const heightMax = Casting.CST_HeightMax;
    let heightReq = 'Any';
    if (heightMin && heightMax) heightReq = `${heightMin} - ${heightMax} cm`;
    else if (heightMin) heightReq = `${heightMin}+ cm`;
    else if (heightMax) heightReq = `Up to ${heightMax} cm`;
    const heightMatch =
      !Model.MOD_Height ||
      ((!heightMin || Model.MOD_Height >= heightMin) &&
        (!heightMax || Model.MOD_Height <= heightMax));

    return [
      {
        label: 'Gender',
        req: genderReqRaw,
        value: Model.MOD_Gender || 'N/A',
        match: genderMatch,
        icon: FaVenusMars,
      },
      {
        label: 'Age',
        req: ageReq,
        value: modelAge > 0 ? `${modelAge} y.o.` : 'N/A',
        match: ageMatch,
        icon: FaBirthdayCake,
      },
      {
        label: 'Height',
        req: heightReq,
        value: Model.MOD_Height ? `${Model.MOD_Height} cm` : 'N/A',
        match: heightMatch,
        icon: FaRulerVertical,
      },
    ];
  }, [Model, Casting]);

  if (!Model || !Casting) {
    return (
      <div className={styles.card}>Error: Model or Casting data missing.</div>
    );
  }

  const handleOpenReject = () => setIsRejectModalOpen(true);
  const handleCloseReject = () => setIsRejectModalOpen(false);
  const handleOpenAccept = () => setIsAcceptModalOpen(true);
  const handleCloseAccept = () => setIsAcceptModalOpen(false);

  const rejectionDraft = generateRejectionDraft(Model, Casting, matchResults);

  const confirmReject = reason => {
    if (onRespond) {
      onRespond({
        id: application.APP_ID,
        data: {
          status: 'rejected',
          rejectionReason: reason,
        },
      });
    }
    handleCloseReject();
  };

  const confirmAccept = ({ invitationText }) => {
    if (onRespond) {
      onRespond({
        id: application.APP_ID,
        data: {
          status: 'accepted',
          invitationText: invitationText,
        },
      });
    }
    handleCloseAccept();
  };

  const modelImage = Model.MOD_Photo
    ? `${CONSTANTS.BASE_URL}${Model.MOD_Photo}`
    : `https://placehold.co/300x400/eee/ccc?text=No+Photo`;

  return (
    <>
      <div className={styles.card}>
        <Link to={`/model/${Model.MOD_ID}`} className={styles.imageLink}>
          <img src={modelImage} alt='Model' className={styles.image} />
        </Link>

        <div className={styles.content}>
          <h3 className={styles.name}>
            {Model.MOD_FirstName} {Model.MOD_LastName}
          </h3>

          <div className={styles.castingInfo}>
            <FaClipboardList
              className={`${styles.icon} ${styles.castingIcon}`}
            />
            <Link
              to={`/castings/${Casting.CST_ID}`}
              className={styles.castingLink}
              title={Casting.CST_Title}
            >
              {Casting.CST_Title}
            </Link>
          </div>

          <div className={styles.details}>
            <span className={styles.detailItem}>
              <FaBirthdayCake className={styles.icon} />
              {calculateAge(Model.MOD_BirthDate) || 'N/A'} y.o.
            </span>
            <span className={styles.detailItem}>
              <FaRulerVertical className={styles.icon} />
              {Model.MOD_Height || 'N/A'} cm
            </span>
          </div>

          <button
            className={styles.matchButton}
            onClick={() => setShowMatch(!showMatch)}
          >
            <FaVial /> {showMatch ? 'Hide Requirements' : 'Check Requirements'}
          </button>

          {showMatch && (
            <div className={styles.matchPanel}>
              {matchResults.map(item => (
                <div key={item.label} className={styles.matchItem}>
                  <div className={styles.matchHeader}>
                    <item.icon
                      className={`${styles.icon} ${styles.matchIcon}`}
                    />
                    <strong>{item.label}</strong>
                  </div>
                  <div className={styles.matchRow}>
                    <span>Requirement:</span>
                    <span>{item.req}</span>
                  </div>
                  <div className={styles.matchRow}>
                    <span>Model:</span>
                    <span className={!item.match ? styles.matchFailValue : ''}>
                      {item.value}
                    </span>
                  </div>
                  {item.match ? (
                    <FaCheckCircle
                      className={`${styles.matchStatus} ${styles.matchSuccess}`}
                    />
                  ) : (
                    <FaTimesCircle
                      className={`${styles.matchStatus} ${styles.matchFail}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <Link to={`/model/${Model.MOD_ID}`} className={styles.profileLink}>
            View Full Profile
          </Link>
        </div>

        {showActions && (
          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.buttonReject}`}
              onClick={handleOpenReject}
            >
              <FaTimes /> Reject
            </button>
            <button
              className={`${styles.button} ${styles.buttonAccept}`}
              onClick={handleOpenAccept}
            >
              <FaCheck /> Accept
            </button>
          </div>
        )}
      </div>

      <RejectionModal
        isOpen={isRejectModalOpen}
        onClose={handleCloseReject}
        onConfirm={confirmReject}
        draft={rejectionDraft}
        modelName={Model.MOD_FirstName}
      />

      <AcceptanceModal
        isOpen={isAcceptModalOpen}
        onClose={handleCloseAccept}
        onConfirm={confirmAccept}
        modelName={Model.MOD_FirstName}
        casting={Casting}
        agency={Casting.Agency}
      />
    </>
  );
}
