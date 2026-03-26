import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllModels } from '../../../store/slices/modelSlice';
import Card from '../../../components/Card';
import Pagination from '../../../components/Pagination';
import defaultAvatarLocal from '../../../../img/default-avatar.jpg';
import InfoModal from '../../../components/InfoModal';
import styles from './ModelsPage.module.sass';
import CONSTANTS from '../../../utils/constants';

export default function ModelsPage () {
  const dispatch = useDispatch();

  const { allModels, loading, totalPages, currentPage } = useSelector(
    state => state.model
  );
  const { user } = useSelector(state => state.auth);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllModels({ page: 1, limit: CONSTANTS.PAGINATION_LIMIT }));
  }, [dispatch]);

  const handlePageChange = pageNumber => {
    if (pageNumber === currentPage) return;

    dispatch(
      fetchAllModels({ page: pageNumber, limit: CONSTANTS.PAGINATION_LIMIT })
    );

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLearnMore = model => {
    if (!user) {
      setShowModal(true);
      return;
    }

    if (user.role === 'agency' || user.role === 'admin') {
      window.location.href = `/model/${model.MOD_ID}`;
      return;
    }

    setShowModal(true);
  };

  const calculateAge = birthDate => {
    if (!birthDate) return 'Unknown';
    const birth = new Date(birthDate);
    const diff = Date.now() - birth.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className={styles.modelsPage}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Our Models</h1>
        <p className={styles.heroText}>
          Explore our catalog of talented models. Each professional brings
          unique experience and collaborates with agencies and brands worldwide.
        </p>
      </section>

      <section className={styles.modelsGrid}>
        {loading && allModels.length === 0 ? (
          <p className={styles.loadingText}>Loading...</p>
        ) : (
          Array.isArray(allModels) &&
          allModels.map(model => {
            const items = [
              model.MOD_Experience
                ? `${model.MOD_Experience} year${
                    model.MOD_Experience > 1 ? 's' : ''
                  } experience`
                : 'No experience',
              model.MOD_Gender || 'Gender not specified',
              `${calculateAge(model.MOD_BirthDate)} y. o.`,
              model.MOD_Height
                ? `${model.MOD_Height} cm`
                : 'Height not specified',
            ];

            return (
              <Card
                key={model.MOD_ID}
                image={
                  model.MOD_Photo
                    ? `${CONSTANTS.BASE_URL}${model.MOD_Photo}`
                    : defaultAvatarLocal
                }
                title={`${model.MOD_FirstName} ${model.MOD_LastName}`}
                items={items}
                buttonText='Learn More'
                onButtonClick={() => handleLearnMore(model)}
              />
            );
          })
        )}
      </section>

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <InfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title='Sign up to see more'
        signupPath='/signup'
      >
        <p>
          Create an account to view detailed model profiles including biography,
          skills, and portfolio.
        </p>
      </InfoModal>
    </div>
  );
}
