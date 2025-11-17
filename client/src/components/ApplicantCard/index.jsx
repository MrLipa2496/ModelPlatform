import React, { useState, useMemo } from 'react'; // 👈 Додано useState, useMemo
import { Link } from 'react-router-dom';
import {
  FaCheck,
  FaTimes,
  FaRulerVertical,
  FaBirthdayCake,
  FaClipboardList,
  FaVenusMars, // 👈 Додано
  FaCheckCircle, // 👈 Додано
  FaTimesCircle, // 👈 Додано
  FaVial, // 👈 Додано (для кнопки "Test")
} from 'react-icons/fa';
import styles from './ApplicantCard.module.sass';

// Хелпер для віку (без змін)
const calculateAge = birthDate => {
  if (!birthDate) return 0; // Повертаємо 0, якщо невідомо
  const diff = Date.now() - new Date(birthDate).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default function ApplicantCard ({
  application,
  onAccept,
  onReject,
  showActions,
}) {
  const { Model, Casting } = application;

  const [showMatch, setShowMatch] = useState(false);

  const matchResults = useMemo(() => {
    if (!Model || !Casting) return [];

    const modelAge = calculateAge(Model.MOD_BirthDate);

    const genderReq = Casting.CST_Gender || 'Any';
    const genderMatch =
      genderReq === 'Any' ||
      !Model.MOD_Gender ||
      genderReq === Model.MOD_Gender;

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
        req: genderReq,
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

  const modelImage = Model.MOD_Photo
    ? `http://localhost:5001${Model.MOD_Photo}`
    : `https://placehold.co/300x400/eee/ccc?text=No+Photo`;

  return (
    <div className={styles.card}>
      <Link to={`/model/${Model.MOD_ID}`} className={styles.imageLink}>
        <img src={modelImage} alt='Model' className={styles.image} />
      </Link>

      <div className={styles.content}>
        <h3 className={styles.name}>
          {Model.MOD_FirstName} {Model.MOD_LastName}
        </h3>

        <div className={styles.castingInfo}>
          <FaClipboardList className={`${styles.icon} ${styles.castingIcon}`} />
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
                  <item.icon className={`${styles.icon} ${styles.matchIcon}`} />
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
            onClick={onReject}
          >
            <FaTimes /> Reject
          </button>
          <button
            className={`${styles.button} ${styles.buttonAccept}`}
            onClick={onAccept}
          >
            <FaCheck /> Accept
          </button>
        </div>
      )}
    </div>
  );
}
