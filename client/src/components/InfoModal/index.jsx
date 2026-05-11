import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './InfoModal.module.sass';

export default function InfoModal ({
  isOpen,
  onClose,
  title,
  children,
  signupPath = '/signup',
  showSignupBtn = true,
  primaryBtnText = 'Sign Up',
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
          {showSignupBtn && (
            <button className={styles.signupButton} onClick={handleSignupClick}>
              {primaryBtnText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
