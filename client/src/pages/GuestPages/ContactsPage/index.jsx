import React, { useState } from 'react';
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaArrowRight,
  FaHandshake,
} from 'react-icons/fa';
import styles from './ContactsPage.module.sass';

export default function ContactsPage () {
  // Стейт для форми (просто для візуалізації роботи)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('Thank you! Your message has been sent to our team.');
    // Тут буде логіка відправки
  };

  return (
    <div className={styles.container}>
      {/* --- HEADER --- */}
      <div className={styles.headerWrapper}>
        <h1 className={styles.title}>
          Let’s Start a <br />
          <span className={styles.gradientText}>Conversation.</span>
        </h1>
        <p className={styles.subtitle}>
          Have a question about the platform? Want to partner with us? Or just
          want to say hello? We are here to help you thrive.
        </p>
      </div>

      {/* --- MAIN GRID --- */}
      <div className={styles.grid}>
        {/* LEFT COLUMN: INFO */}
        <div className={styles.infoColumn}>
          {/* Contact Block */}
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
              <FaHandshake className={styles.icon} />{' '}
              {/* Якщо немає Handshake, заміни на FaEnvelope */}
              <div>
                <span className={styles.label}>Partnerships & Press</span>
                <a href='mailto:partners@lipax.com' className={styles.link}>
                  partners@lipax.com
                </a>
              </div>
            </div>
          </div>

          {/* Location Block */}
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

          {/* Socials */}
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

        {/* RIGHT COLUMN: FORM */}
        <div className={styles.formColumn}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor='name'>Your Name</label>
              <input
                type='text'
                name='name'
                id='name'
                placeholder='John Doe'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor='email'>Email Address</label>
              <input
                type='email'
                name='email'
                id='email'
                placeholder='john@example.com'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor='subject'>Subject</label>
              <select
                name='subject'
                id='subject'
                value={formData.subject}
                onChange={handleChange}
                className={styles.select}
              >
                <option value=''>Select a topic</option>
                <option value='support'>Technical Support</option>
                <option value='billing'>Billing & Payments</option>
                <option value='partnership'>Agency Partnership</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor='message'>Message</label>
              <textarea
                name='message'
                id='message'
                rows='4'
                placeholder='Tell us how we can help...'
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type='submit' className={styles.submitBtn}>
              Send Message <FaArrowRight className={styles.btnIcon} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
