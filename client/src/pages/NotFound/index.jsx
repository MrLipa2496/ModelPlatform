import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.sass';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          Sorry, the page you are looking for does not exist, has been deleted,
          or is temporarily unavailable.
        </p>
        <button className={styles.homeBtn} onClick={() => navigate('/')}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
