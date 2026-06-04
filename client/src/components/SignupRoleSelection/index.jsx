import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserAstronaut, FaBuilding } from 'react-icons/fa';
import styles from './SignupRoleSelection.module.sass';
import AuthLayout from '../AuthLayout';
import selectionBg from '../../../img/formsFoto/selectionBg.jpg';

const SignupRoleSelection = () => {
  return (
    <AuthLayout imageSrc={selectionBg}>
      <div className={styles.selectionWrapper}>
        <h2 className={styles.title}>Join as...</h2>
        <p className={styles.subtitle}>
          Choose your account type to get started
        </p>

        <div className={styles.cardsContainer}>
          <Link to='/signup/model' className={styles.card}>
            <div className={styles.iconBox}>
              <FaUserAstronaut />
            </div>
            <h3>Model</h3>
            <p>Showcase your portfolio and get scouted.</p>
          </Link>

          <Link to='/signup/agency' className={styles.card}>
            <div className={styles.iconBox}>
              <FaBuilding />
            </div>
            <h3>Agency</h3>
            <p>Find new faces and manage castings.</p>
          </Link>
        </div>

        <div className={styles.footerLink}>
          Already have an account? <Link to='/login'>Log In</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupRoleSelection;
