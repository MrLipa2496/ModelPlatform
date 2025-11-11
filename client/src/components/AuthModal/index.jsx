import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthModal.module.sass';

export default function AuthModal ({
  isOpen,
  onClose,
  title,
  children,
  signupPath = '/signup',
}) {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const handleModalClick = e => {
    e.stopPropagation();
  };

  const handleSignupClick = () => {
    navigate(signupPath);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={handleModalClick}>
        <h2 className={styles.modalTitle}>{title}</h2>

        <div className={styles.modalContent}>{children}</div>

        <div className={styles.modalActions}>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
          <button className={styles.signupButton} onClick={handleSignupClick}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
