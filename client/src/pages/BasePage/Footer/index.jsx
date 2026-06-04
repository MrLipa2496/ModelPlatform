import React from 'react';
import { NavLink } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import styles from './Footer.module.sass';

export default function Footer () {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topSection}>
          <div className={styles.brandCol}>
            <h2 className={styles.brandName}>LipaX</h2>
            <p className={styles.brandDesc}>
              The next-generation ecosystem connecting top-tier modeling
              talents, agencies, and global brands.
            </p>
            <div className={styles.socials}>
              <a href='#' className={styles.socialIcon} aria-label='Instagram'>
                <Instagram size={20} />
              </a>
              <a href='#' className={styles.socialIcon} aria-label='Twitter'>
                <Twitter size={20} />
              </a>
              <a href='#' className={styles.socialIcon} aria-label='LinkedIn'>
                <Linkedin size={20} />
              </a>
              <a
                href='https://github.com/MrLipa2496'
                target='_blank'
                rel='noreferrer'
                className={styles.socialIcon}
                aria-label='GitHub'
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          <div className={styles.linksCol}>
            <h4>Platform</h4>
            <NavLink to='/models'>Models</NavLink>
            <NavLink to='/agencies'>Agencies</NavLink>
            <NavLink to='/castings'>Castings</NavLink>
            <NavLink to='/signup'>Join Now</NavLink>
          </div>

          <div className={styles.linksCol}>
            <h4>Company</h4>
            <NavLink to='/about'>About Us</NavLink>
            <NavLink to='/contacts'>Contact</NavLink>
            <NavLink to='/faq'>Help & FAQ</NavLink>
          </div>

          <div className={styles.linksCol}>
            <h4>Legal</h4>
            <NavLink to='/privacy'>Privacy Policy</NavLink>
            <NavLink to='/terms'>Terms of Service</NavLink>
            <NavLink to='/guidelines'>Community Guidelines</NavLink>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.copyright}>
            &copy; {currentYear} LipaX Platform. All rights reserved.
          </div>
          <div className={styles.creator}>
            Designed & Developed by <span>Oleksandr Lipchanskyi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
