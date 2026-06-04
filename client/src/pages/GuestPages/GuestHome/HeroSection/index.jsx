import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import homeBg1 from '../../../../../img/home-bg1.jpg';
import styles from './HeroSection.module.sass';

export default function HeroSection () {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const offset = Math.max(-windowH, Math.min(windowH, rect.top));

      const titleY = offset * -0.05;
      const imageY = offset * -0.1;

      if (titleRef.current)
        titleRef.current.style.transform = `translateY(${titleY}px)`;
      if (imageRef.current)
        imageRef.current.style.transform = `translateY(${imageY}px)`;
    };

    const handle = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(onScroll);
    };

    window.addEventListener('scroll', handle, { passive: true });
    handle();

    return () => {
      window.removeEventListener('scroll', handle);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const stats = [
    { value: '10k+', label: 'Verified Models' },
    { value: '500+', label: 'Global Agencies' },
  ];

  return (
    <section className={styles.hero} ref={rootRef} aria-label='Hero'>
      <div className={styles.backgroundGlow}></div>

      <div className={`${styles.inner} ${visible ? styles.visible : ''}`}>
        <div className={styles.left}>
          <div className={styles.badge}>The New Standard</div>

          <h1 ref={titleRef} className={styles.title}>
            The Future of <br />
            <span className={styles.gradient}>Modeling</span> is Here.
          </h1>

          <p className={styles.subtitle}>
            Join LipaX — the definitive ecosystem connecting top-tier talents,
            agencies, and brands with absolute transparency and style.
          </p>

          <div className={styles.buttons}>
            <NavLink className={styles.btnPrimary} to='/signup/model'>
              Join as Model
            </NavLink>
            <NavLink className={styles.btnSecondary} to='/signup/agency'>
              Join as Agency
            </NavLink>
          </div>

          <div className={styles.stats}>
            {stats.map((s, i) => (
              <div key={i} className={styles.stat}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.right} ref={imageRef}>
          <div className={styles.imageWrapper}>
            <img
              src={homeBg1}
              alt='LipaX Models'
              className={styles.mainImage}
            />

            <div className={`${styles.glassCard} ${styles.glassTop}`}>
              <span className={styles.liveIndicator}></span> Actively Casting
            </div>

            <div className={`${styles.glassCard} ${styles.glassBottom}`}>
              <div className={styles.secureIcon}>
                <svg
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
                </svg>
              </div>
              <div>
                <strong>100% Secure</strong>
                <span>Verified Profiles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
