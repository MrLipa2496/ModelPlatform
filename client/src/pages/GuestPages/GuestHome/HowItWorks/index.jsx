import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CONSTANTS from '../../../../utils/constants';
import styles from './HowItWorks.module.sass';

export default function HowItWorks () {
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
      { threshold: 0.2 }
    );

    const stepElements = sectionRef.current?.querySelectorAll(
      `.${styles.step}`
    );
    if (stepElements) {
      stepElements.forEach(el => observer.observe(el));
    }

    return () => {
      if (stepElements) stepElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section className={styles.howItWorks} ref={sectionRef}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            How It <span className={styles.gradient}>Works</span>
          </h2>
          <p className={styles.subtitle}>
            From creating your profile to signing global offers — everything
            happens seamlessly in one place.
          </p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.connectorLine}></div>

          {CONSTANTS.HOW_IT_WORKS_STEPS.map((step, index) => {
            const IconComponent = step.icon;
            const stepNumber = String(index + 1).padStart(2, '0');

            return (
              <NavLink key={index} to={step.link} className={styles.stepLink}>
                <div
                  className={styles.step}
                  style={{ transitionDelay: `${index * 0.15}s` }}
                >
                  <div className={styles.watermark}>{stepNumber}</div>
                  <div className={styles.iconWrapper}>
                    <div className={styles.iconGradientBg}></div>
                    <IconComponent
                      className={styles.icon}
                      strokeWidth={2}
                      size={32}
                    />
                  </div>

                  <div className={styles.content}>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>

                  <p className={styles.stepLink}>
                    {step.linkText} <ArrowRight size={16} />
                  </p>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
