import React from 'react';
import styles from './Footer.module.sass';

function Footer () {
  return (
    <div className={styles.footerWrapper}>
      <nav className={styles.linksContainer}>
        <ul>
          <li>
            Company: <span>MrLipa Travel Agency</span>
          </li>
          <li>
            Country: <span>Ukraine</span>
          </li>
          <li>
            Mob. Phone: <a href='tel:380630274960'>+380630274960</a>
          </li>
        </ul>
        <ul>
          <li>
            Email: <a href='mailto:mrlipa629@gmail.com'>mrlipa629@gmail.com</a>
          </li>
          <li>
            Instagram:{' '}
            <a href='https://www.instagram.com/alex_aionios?igsh=N2VubWozaGFldjV0'>
              alex_aionios
            </a>
          </li>
          <li>
            GitHub: <a href='https://github.com/MrLipa2496'>MrLipa2496</a>
          </li>
        </ul>
      </nav>
      <div className={styles.copyright}>
        &copy; 2025 Lipchansky Company. All rights reserved.
      </div>
    </div>
  );
}

export default Footer;
