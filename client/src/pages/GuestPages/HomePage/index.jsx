import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import homeBg1 from '../../../../img/home-bg1.jpg';
import homeBg2 from '../../../../img/home-bg2.jpg';
import homeBg3 from '../../../../img/home-bg3.jpg';
import homeBg4 from '../../../../img/home-bg4.jpg';
import AboutSection from './AboutSection';
import styles from './HomePage.module.sass';

const images = [homeBg1, homeBg2, homeBg3, homeBg4];

function HomePage () {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev === images.length - 1) {
          setDirection(-1);
          return prev - 1;
        }
        if (prev === 0) {
          setDirection(1);
          return prev + 1;
        }
        return prev + direction;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [direction]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.slider}>
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Slide ${i + 1}`}
              className={`${styles.homeBg} ${
                i === currentIndex ? styles.active : ''
              }`}
            />
          ))}
        </div>

        <div className={`${styles.overlay} ${isVisible ? styles.fadeIn : ''}`}>
          <div className={styles.content}>
            <h1>The Future of Modeling is Here</h1>
            <p>
              Join the platform where models, agencies, and clients connect
              seamlessly to shape the next generation of fashion.
            </p>
            <div className={styles.buttons}>
              <NavLink className={styles.btnPrimary} to='/signup'>
                Join as Model
              </NavLink>
              <NavLink className={styles.btnSecondary} to='/signup'>
                Join as Agency
              </NavLink>
            </div>
            <NavLink className={styles.btnOutline} to='/models'>
              Discover Talent
            </NavLink>
          </div>
        </div>
      </div>
      <AboutSection />
    </>
  );
}

export default HomePage;
