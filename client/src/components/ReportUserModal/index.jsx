import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  submitReport,
  clearReportStatus,
} from '../../store/slices/reportSlice';
import { FaPaperclip, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import InfoModal from '../InfoModal';
import styles from './ReportUserModal.module.sass';

export default function ReportUserModal ({
  isOpen,
  onClose,
  reportedUserId,
  reportedUserName,
}) {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(state => state.report);

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    if (success) {
      alert('Report submitted successfully.');
      handleClose();
    }
  }, [success]);

  const handleClose = () => {
    setFormData({ subject: '', message: '' });
    setAttachment(null);
    dispatch(clearReportStatus());
    onClose();
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('type', 'complaint');
    submitData.append('subject', formData.subject);
    submitData.append('message', formData.message);

    if (
      reportedUserId &&
      reportedUserId !== 'undefined' &&
      reportedUserId !== 'null'
    ) {
      submitData.append('reportedUserId', reportedUserId);
    }

    if (attachment) {
      submitData.append('attachment', attachment);
    }

    dispatch(submitReport(submitData));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose}>
          <FaTimes />
        </button>

        <div className={styles.header}>
          <FaExclamationCircle className={styles.alertIcon} />
          <h2>Report User</h2>
          <p>
            You are reporting: <strong>{reportedUserName}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor='subject'>Reason for reporting</label>
            <input
              type='text'
              name='subject'
              id='subject'
              placeholder='e.g. Inappropriate behavior, Spam, Scam'
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='message'>Details</label>
            <textarea
              name='message'
              id='message'
              rows='4'
              placeholder='Please provide specific details about the violation...'
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className={styles.inputGroup}>
            <label>Proof / Screenshot (Optional)</label>
            <div className={styles.fileInputWrapper}>
              <input
                type='file'
                accept='image/jpeg, image/png, image/webp'
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <div className={styles.customFileBtn}>
                <FaPaperclip /> {attachment ? attachment.name : 'Attach a file'}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type='button'
              className={styles.cancelBtn}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type='submit'
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
