import React, { useEffect, useRef } from 'react';
import CONSTANTS from '../../../../utils/constants';
import styles from './AboutSection.module.sass';

export default function AboutSection () {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.15 }
    );

    const blocks = sectionRef.current?.querySelectorAll(`.${styles.bentoCard}`);
    if (blocks) {
      blocks.forEach(block => observer.observe(block));
    }

    return () => {
      if (blocks) blocks.forEach(block => observer.unobserve(block));
    };
  }, []);

  return (
    <section className={styles.about} ref={sectionRef}>
      <div className={styles.bgGlow1}></div>
      <div className={styles.bgGlow2}></div>

      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Why <span className={styles.gradient}>LipaX</span>?
          </h2>
          <p className={styles.subtitle}>
            A next-generation ecosystem built to connect models, agencies, and
            clients in one seamless, high-performance platform.
          </p>
        </div>

        <div className={styles.grid}>
          {CONSTANTS.ABOUT_ITEMS.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <div
                key={index}
                className={styles.bentoCard}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className={styles.iconWrapper}>
                  <div className={styles.iconGradientBg}></div>
                  <div className={styles.iconInner}>
                    <IconComponent strokeWidth={2.5} size={32} />
                  </div>
                </div>
                <div className={styles.text}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
