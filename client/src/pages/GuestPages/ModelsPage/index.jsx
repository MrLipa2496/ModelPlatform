import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllModels } from '../../../store/slices/modelSlice';
import Card from '../../../components/Card';
import AuthModal from '../../../components/AuthModal';
import styles from './ModelsPage.module.sass';

export default function ModelsPage () {
  const dispatch = useDispatch();

  const { allModels, loading } = useSelector(state => state.model);
  const { user } = useSelector(state => state.auth);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllModels());
  }, [dispatch]);

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
    if (!birthDate) return 'Unknown age';
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
        {loading ? (
          <p className={styles.loadingText}>Loading...</p>
        ) : (
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
                image={`http://localhost:5001${model.MOD_Photo}`}
                title={`${model.MOD_FirstName} ${model.MOD_LastName}`}
                items={items}
                buttonText='Learn More'
                onButtonClick={() => handleLearnMore(model)}
              />
            );
          })
        )}
      </section>

      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title='Sign up to see more'
        signupPath='/signup'
      >
        <p>
          Create an account to view detailed model profiles including biography,
          skills, and portfolio.
        </p>
      </AuthModal>
    </div>
  );
}
