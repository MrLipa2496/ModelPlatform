import React from 'react';
import styles from './AuthLayout.module.sass';

export default function AuthLayout ({ children, imageSrc }) {
  return (
    <div className={styles.authPage}>
      <div className={styles.leftSide}>
        <img src={imageSrc} alt='Auth' className={styles.sideImage} />
      </div>
      <div className={styles.rightSide}>{children}</div>
    </div>
  );
}
