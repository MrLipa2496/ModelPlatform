import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import classNames from 'classnames';
import styles from './Header.module.sass';

function Header () {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinkClassName = ({ isActive }) =>
    classNames(styles.navLink, { [styles.active]: isActive });

  return (
    <header className={styles.headerWrapper}>
      <NavLink className={styles.logoNavLink} to='/'>
        <div className={styles.headerLogoWrapper}>
          <p className={styles.headerLogo}>
            Lipa<span className={styles.headerAbbreviation}>X</span>
          </p>
        </div>
      </NavLink>

      <button className={styles.menuBtn} onClick={toggleMenu}>
        <GiHamburgerMenu />
      </button>

      <nav
        className={classNames(styles.headerNav, {
          [styles.menuOpen]: isMenuOpen,
        })}
      >
        <li className={styles.navLi}>
          <NavLink className={navLinkClassName} to='/'>
            Home
          </NavLink>
        </li>
        <li className={styles.navLi}>
          <NavLink className={navLinkClassName} to='/tours'>
            Tours
          </NavLink>
        </li>
        <li className={styles.navLi}>
          <NavLink className={navLinkClassName} to='/booking'>
            Booking
          </NavLink>
        </li>
        <li className={styles.navLi}>
          <NavLink className={navLinkClassName} to='/transport'>
            Transport
          </NavLink>
        </li>
        <li className={styles.navLi}>
          <NavLink className={navLinkClassName} to='/hotels'>
            Hotels
          </NavLink>
        </li>
        <li className={styles.navLi}>
          <NavLink className={navLinkClassName} to='/contacts'>
            Contacts
          </NavLink>
        </li>
      </nav>
    </header>
  );
}

export default Header;
