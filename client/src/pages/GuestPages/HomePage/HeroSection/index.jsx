import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import homeBg1 from '../../../../../img/home-bg1.jpg';
import styles from './HeroSection.module.sass';

export default function HeroSection () {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const deviceRef = useRef(null);
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
      const titleY = offset * -0.08;
      const deviceY = offset * -0.18;
      if (titleRef.current)
        titleRef.current.style.transform = `translateY(${titleY}px)`;
      if (deviceRef.current)
        deviceRef.current.style.transform = `translateY(${deviceY}px)`;
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
    { emoji: '🔥', value: '10k+', label: 'Models' },
    { emoji: '🌍', value: '50+', label: 'Countries' },
    { emoji: '🏢', value: '500+', label: 'Agencies' },
  ];

  return (
    <section className={styles.hero} ref={rootRef} aria-label='Hero'>
      <div className={`${styles.inner}${visible ? ` ${styles.visible}` : ''}`}>
        <div className={styles.left}>
          <h1 ref={titleRef} className={styles.title}>
            The Future of <span className={styles.gradient}>Modeling</span> is
            Here
          </h1>
          <p className={styles.subtitle}>
            Join LipaX — the next-generation platform connecting models,
            agencies, and clients in a smart ecosystem built for transparency
            and growth.
          </p>

          <div className={styles.ctaGroup}>
            <div className={styles.buttons}>
              <NavLink className={styles.btnPrimary} to='/signup'>
                Join as Model
              </NavLink>
              <NavLink className={styles.btnSecondary} to='/signup'>
                Join as Agency
              </NavLink>
            </div>

            <NavLink className={styles.btnOutline} to='/discover'>
              Discover Talent
            </NavLink>
          </div>

          <div className={styles.stats}>
            {stats.map((s, i) => (
              <div key={i} className={styles.stat}>
                <div className={styles.statEmoji}>{s.emoji}</div>
                <div className={styles.statBody}>
                  <div className={styles.statValue}>{s.value}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.blobs}>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>
            <div className={`${styles.blob} ${styles.blob3}`}></div>
          </div>

          {/* device mockup */}
          <div className={styles.deviceWrap} ref={deviceRef}>
            <div className={styles.device}>
              <div
                className={styles.deviceScreen}
                style={{ backgroundImage: `url(${homeBg1})` }}
                role='img'
                aria-label='platform screenshot'
              />
              <div className={styles.deviceBase} />
            </div>

            {/* silhouette / model svg overlay */}
            <div className={styles.modelSilhouette} aria-hidden='true'>
              {/* simple SVG silhouette — replace or hide as needed */}
              <svg viewBox='0 0 200 300' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                  <linearGradient id='sg' x1='0' x2='1'>
                    <stop offset='0%' stopColor='#ff7a9a' />
                    <stop offset='100%' stopColor='#8b00ff' />
                  </linearGradient>
                </defs>
                <g
                  fill='none'
                  stroke='url(#sg)'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                ></g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
