import React from 'react';
import { UserPlus, Link2, Rocket } from 'lucide-react';
import styles from './HowItWorks.module.sass';

const steps = [
  {
    icon: <UserPlus />,
    title: 'Create Your Profile',
    text: 'Start by building your personal modeling profile — add your best shots, stats, and story to showcase your potential.',
    link: '/signup',
  },
  {
    icon: <Link2 />,
    title: 'Connect with Agencies & Clients',
    text: 'Explore opportunities, send applications, and get discovered by top modeling agencies and brands from around the world.',
    link: '/agencies',
  },
  {
    icon: <Rocket />,
    title: 'Collaborate & Grow',
    text: 'Sign offers, participate in real campaigns, and grow your modeling career with global exposure and professional guidance.',
    link: '/signup',
  },
];

export default function HowItWorks () {
  return (
    <section className={styles.howItWorks}>
      <h2 className={styles.title}>How It Works</h2>
      <p className={styles.subtitle}>
        From creating your profile to signing offers — everything happens in one
        place.
      </p>

      <div className={styles.timeline}>
        {steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <div className={styles.iconWrapper}>
              <a href={step.link} className={styles.icon}>
                {step.icon}
              </a>
              {index < steps.length - 1 && (
                <div className={styles.connector}></div>
              )}
            </div>
            <div className={styles.content}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
