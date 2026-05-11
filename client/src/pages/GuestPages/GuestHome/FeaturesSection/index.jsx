import React from 'react';
import { Shield, Globe2, MessageSquare, Camera, BarChart3 } from 'lucide-react';
import styles from './FeaturesSection.module.sass';

const features = [
  {
    icon: <Shield />,
    title: 'Secure Deals & Moderation',
    text: 'Every offer is reviewed and verified to protect both models and agencies — transparency first.',
  },
  {
    icon: <Globe2 />,
    title: 'Global Network',
    text: 'Connect with trusted international agencies and clients. Expand your reach beyond borders.',
  },
  {
    icon: <MessageSquare />,
    title: 'Built-in Chat & Offers',
    text: 'Negotiate, sign, and collaborate directly inside the platform — simple, fast, and intuitive.',
  },
  {
    icon: <Camera />,
    title: 'Professional Portfolios',
    text: 'Showcase your work through elegant portfolio galleries that make your talent stand out.',
  },
  {
    icon: <BarChart3 />,
    title: 'Smart Analytics',
    text: 'Track your profile growth, engagement, and performance insights in real time.',
  },
];

const FeaturesSection = () => {
  return (
    <section className={styles.features}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Why Choose Our Platform</h2>
        <p className={styles.subtitle}>
          A new standard for digital modeling — built for trust, creativity, and
          success.
        </p>

        <div className={styles.grid}>
          {features.map((item, index) => (
            <div key={index} className={styles.feature}>
              <div className={styles.iconWrapper}>
                <div className={styles.icon}>{item.icon}</div>
              </div>
              <div className={styles.text}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.gradientCircle1}></div>
      <div className={styles.gradientCircle2}></div>
    </section>
  );
};

export default FeaturesSection;
