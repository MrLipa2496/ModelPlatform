import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAgencyById } from '../../../store/slices/agencySlice';
import AgencyCard from '../../../components/AgencyCard';
import CastingCard from '../../../components/CastingCard';
import styles from './AgencyDetailsPage.module.sass';

export default function AgencyDetailsPage () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedAgency, loading } = useSelector(state => state.agency);

  useEffect(() => {
    if (id) {
      dispatch(fetchAgencyById(id));
    }
  }, [dispatch, id]);

  if (loading || !selectedAgency) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Loading agency profile...</p>
      </div>
    );
  }

  const agencyCastings = selectedAgency.Castings || [];

  const handleCastingClick = cstId => {
    navigate(`/castings/${cstId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <AgencyCard agency={selectedAgency} isEditable={false} />

      <div className={styles.castingsSection}>
        <h3 className={styles.sectionTitle}>Open Castings</h3>

        {agencyCastings.length > 0 ? (
          <div className={styles.castingsGrid}>
            {agencyCastings.map(casting => {
              const castingWithAgency = {
                ...casting,
                Agency: selectedAgency,
              };

              return (
                <CastingCard
                  key={casting.CST_ID}
                  casting={castingWithAgency}
                  onButtonClick={() => handleCastingClick(casting.CST_ID)}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>This agency has no open castings at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
