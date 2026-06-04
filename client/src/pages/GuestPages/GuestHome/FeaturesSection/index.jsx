import React, { useEffect, useRef } from 'react';
import CONSTANTS from '../../../../utils/constants';
import styles from './FeaturesSection.module.sass';

export default function FeaturesSection () {
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
      { threshold: 0.1 }
    );

    const rows = sectionRef.current?.querySelectorAll(`.${styles.featureRow}`);
    if (rows) {
      rows.forEach(row => observer.observe(row));
    }

    return () => {
      if (rows) rows.forEach(row => observer.unobserve(row));
    };
  }, []);

  return (
    <section className={styles.features} ref={sectionRef}>
      <div className={styles.inner}>
        <div className={styles.stickyColumn}>
          <div className={styles.stickyContent}>
            <h2 className={styles.title}>
              Why Choose <br />{' '}
              <span className={styles.gradient}>Our Platform</span>
            </h2>
            <p className={styles.subtitle}>
              A new standard for digital modeling — precision-built for trust,
              creativity, and unprecedented success.
            </p>
          </div>
        </div>

        <div className={styles.scrollColumn}>
          {CONSTANTS.FEATURES.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className={styles.featureRow}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className={styles.iconWrapper}>
                  <IconComponent
                    size={28}
                    strokeWidth={2}
                    className={styles.icon}
                  />
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
