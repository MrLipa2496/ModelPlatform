import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  submitReport,
  clearReportStatus,
} from '../../../store/slices/reportSlice';
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaArrowRight,
  FaHandshake,
  FaPaperclip,
} from 'react-icons/fa';
import InfoModal from '../../../components/InfoModal';
import styles from './ContactsPage.module.sass';

export default function ContactsPage () {
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(state => state.report);

  const [formData, setFormData] = useState({
    type: 'technical',
    subject: '',
    message: '',
  });
  const [attachment, setAttachment] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (success) {
      setIsModalOpen(true);

      setFormData({ type: 'technical', subject: '', message: '' });
      setAttachment(null);

      dispatch(clearReportStatus());
    }
  }, [success, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearReportStatus());
    };
  }, [dispatch]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('type', formData.type);
    submitData.append('subject', formData.subject);
    submitData.append('message', formData.message);

    if (attachment) {
      submitData.append('attachment', attachment);
    }

    dispatch(submitReport(submitData));
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h1 className={styles.title}>
          Let’s Start a <br />
          <span className={styles.gradientText}>Conversation.</span>
        </h1>
        <p className={styles.subtitle}>
          Have a question about the platform? Need to report an issue? Or just
          want to say hello? We are here to help you thrive.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.infoColumn}>
          <div className={styles.infoBlock}>
            <h3>Email Us</h3>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.icon} />
              <div>
                <span className={styles.label}>General Support</span>
                <a href='mailto:support@lipax.com' className={styles.link}>
                  support@lipax.com
                </a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <FaHandshake className={styles.icon} />
              <div>
                <span className={styles.label}>Partnerships & Press</span>
                <a href='mailto:partners@lipax.com' className={styles.link}>
                  partners@lipax.com
                </a>
              </div>
            </div>
          </div>

          <div className={styles.infoBlock}>
            <h3>Visit HQ</h3>
            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.icon} />
              <div>
                <span className={styles.label}>Global Office</span>
                <p className={styles.text}>
                  123 Fashion Avenue, Suite 404
                  <br />
                  New York, NY 10018
                </p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <FaPhoneAlt className={styles.icon} />
              <div>
                <span className={styles.label}>Phone (Mon-Fri)</span>
                <p className={styles.text}>+1 (555) 000-1234</p>
              </div>
            </div>
          </div>

          <div className={styles.socials}>
            <a href='#' className={styles.socialLink}>
              <FaInstagram />
            </a>
            <a href='#' className={styles.socialLink}>
              <FaLinkedinIn />
            </a>
            <a href='#' className={styles.socialLink}>
              <FaTwitter />
            </a>
          </div>
        </div>

        <div className={styles.formColumn}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor='type'>Category</label>
              <select
                name='type'
                id='type'
                value={formData.type}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value='technical'>
                  Technical Support (Bugs/Errors)
                </option>
                <option value='complaint'>Report a User / Agency</option>
                <option value='suggestion'>Partnership / Suggestion</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor='subject'>Subject</label>
              <input
                type='text'
                name='subject'
                id='subject'
                placeholder='Brief description of your request'
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor='message'>Message</label>
              <textarea
                name='message'
                id='message'
                rows='5'
                placeholder='Please provide as many details as possible...'
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor='attachment'>Attachment (Optional)</label>
              <div className={styles.fileInputWrapper}>
                <input
                  type='file'
                  name='attachment'
                  id='attachment'
                  accept='image/jpeg, image/png, image/webp'
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                <div className={styles.customFileBtn}>
                  <FaPaperclip />{' '}
                  {attachment ? attachment.name : 'Attach a screenshot'}
                </div>
              </div>
            </div>

            <button
              type='submit'
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  Send Message <FaArrowRight className={styles.btnIcon} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Report Submitted'
        showSignupBtn={false}
      >
        <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '1rem' }}>
          Thank you! Your message has been successfully sent to our support
          team. We will review it and get back to you shortly.
        </p>
      </InfoModal>
    </div>
  );
}
