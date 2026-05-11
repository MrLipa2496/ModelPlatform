import { useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { CgProfile } from 'react-icons/cg';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { logout } from '../../../store/slices/authSlice';
import CONSTANTS from '../../../utils/constants';
import styles from './Header.module.sass';

function Header () {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isFetching } = useSelector(state => state.auth);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate('/login');
  };

  const navConfig = useMemo(() => {
    return CONSTANTS && CONSTANTS.NAV_CONFIG;
  }, []);

  const currentRole = user?.role || 'guest';
  const navLinks = navConfig[currentRole] || [];

  const navLinkClassName = ({ isActive }, customClass) =>
    classNames(styles.navLink, customClass, { [styles.active]: isActive });

  const authLinks = navLinks.filter(
    l => l.label === 'Login' || l.label === 'SignUp'
  );

  const regularLinks = navLinks.filter(
    l => l.label !== 'Login' && l.label !== 'SignUp'
  );

  return (
    <header className={styles.headerWrapper}>
      <NavLink className={styles.logoNavLink} to='/' onClick={closeMenu}>
        <div className={styles.headerLogoWrapper}>
          <p className={styles.headerLogo}>
            Lipa<span className={styles.headerAbbreviation}>X</span>
          </p>
        </div>
      </NavLink>

      <button className={styles.menuBtn} onClick={toggleMenu} aria-label='Menu'>
        <GiHamburgerMenu />
      </button>

      <nav
        className={classNames(styles.headerNav, {
          [styles.menuOpen]: isMenuOpen,
        })}
      >
        {regularLinks.map(({ to, label, className }) => (
          <li key={to} className={styles.navLi}>
            <NavLink
              className={props => navLinkClassName(props, className)}
              to={to}
              onClick={closeMenu}
            >
              {label === 'Profile' ? (
                <CgProfile className={styles.profileIcon} />
              ) : (
                label
              )}
            </NavLink>
          </li>
        ))}

        {currentRole === 'guest' && authLinks.length > 0 && (
          <li className={classNames(styles.navLi, styles.authNavLi)}>
            <div className={styles.authButtonsWrapper}>
              {authLinks.map(({ to, label, className }) => (
                <NavLink
                  key={to}
                  className={props => navLinkClassName(props, className)}
                  to={to}
                  onClick={closeMenu}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </li>
        )}

        {user && (
          <li className={styles.navLi}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </li>
        )}
      </nav>
    </header>
  );
}

export default Header;
