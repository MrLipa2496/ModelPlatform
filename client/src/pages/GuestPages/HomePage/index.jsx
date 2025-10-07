import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import homeBg1 from '../../../../img/home-bg1.jpg';
import homeBg2 from '../../../../img/home-bg2.jpg';
import homeBg3 from '../../../../img/home-bg3.jpg';
import homeBg4 from '../../../../img/home-bg4.jpg';
import styles from './HomePage.module.sass';

const images = [homeBg1, homeBg2, homeBg3, homeBg4];

function HomePage () {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

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

  return (
    <div className={styles.container}>
      <div
        className={styles.slider}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Slide ${i + 1}`}
            className={styles.homeBg}
          />
        ))}
      </div>

      <div className={styles.overlay}>
        <h1>Where Talent Meets Opportunity</h1>
        <p>
          Connect with top agencies, discover new opportunities, and elevate
          your modeling career.
        </p>
        <NavLink className={styles.link} to='/signup'>
          Explore
        </NavLink>
      </div>
    </div>
  );
}

export default HomePage;
