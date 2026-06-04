import { useState, useMemo, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { CgProfile, CgClose } from 'react-icons/cg';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { logout } from '../../../store/slices/authSlice';
import CONSTANTS from '../../../utils/constants';
import styles from './Header.module.sass';

function Header () {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
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
      <div className={styles.innerContainer}>
        <NavLink className={styles.logoNavLink} to='/'>
          <div className={styles.headerLogoWrapper}>
            <p className={styles.headerLogo}>
              Lipa<span className={styles.headerAbbreviation}>X</span>
            </p>
          </div>
        </NavLink>

        <button
          className={styles.menuBtn}
          onClick={toggleMenu}
          aria-label='Menu'
        >
          {isMenuOpen ? <CgClose /> : <GiHamburgerMenu />}
        </button>

        <nav
          className={classNames(styles.headerNav, {
            [styles.menuOpen]: isMenuOpen,
          })}
        >
          <ul className={styles.navList}>
            {regularLinks.map(({ to, label, className }) => (
              <li key={to} className={styles.navLi}>
                <NavLink
                  className={props => navLinkClassName(props, className)}
                  to={to}
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
              <li className={classNames(styles.navLi, styles.authGroup)}>
                {authLinks.map(({ to, label, className }) => (
                  <NavLink
                    key={to}
                    className={props => navLinkClassName(props, className)}
                    to={to}
                  >
                    {label}
                  </NavLink>
                ))}
              </li>
            )}

            {user && (
              <li className={styles.navLi}>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
