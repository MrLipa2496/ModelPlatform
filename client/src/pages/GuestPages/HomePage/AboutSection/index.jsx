import { useEffect, useRef } from 'react';
import {
  Users,
  Building2,
  Briefcase,
  Globe,
  Shield,
  Sparkles,
} from 'lucide-react';
import styles from './AboutSection.module.sass';

const aboutItems = [
  {
    icon: <Users className={styles.icon} />,
    title: 'Empowering Models',
    text: 'Showcase your talent, grow your personal brand, and connect directly with verified agencies and clients worldwide. Take full control of your modeling journey.',
  },
  {
    icon: <Building2 className={styles.icon} />,
    title: 'Tools for Agencies',
    text: 'Manage your portfolio, promote models, and collaborate with global brands and partners — all in one professional dashboard.',
  },
  {
    icon: <Briefcase className={styles.icon} />,
    title: 'Opportunities for Clients',
    text: 'Find the perfect face for your campaign or fashion event. LipaX ensures transparent access to top-tier talents across the globe.',
  },
  {
    icon: <Globe className={styles.icon} />,
    title: 'Global Network',
    text: 'From Milan to Tokyo — LipaX connects the modeling world, fostering an inclusive and borderless professional environment.',
  },
  {
    icon: <Shield className={styles.icon} />,
    title: 'Safety & Verification',
    text: 'Every profile and agency is verified, ensuring trust, safety, and professionalism within our growing community.',
  },
  {
    icon: <Sparkles className={styles.icon} />,
    title: 'Innovation & Growth',
    text: 'We combine technology and creativity to make talent discovery faster, smarter, and more inspiring than ever before.',
  },
];

const AboutSection = () => {
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

    const blocks = sectionRef.current.querySelectorAll(`.${styles.block}`);
    blocks.forEach(block => observer.observe(block));

    return () => blocks.forEach(block => observer.unobserve(block));
  }, []);

  return (
    <section className={styles.about} ref={sectionRef}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          About <span>LipaX</span>
        </h2>
        <p className={styles.subtitle}>
          LipaX is a next-generation ecosystem built to connect models,
          agencies, and clients in one seamless platform — making the fashion
          world transparent, efficient, and inspiring.
        </p>

        <div className={styles.grid}>
          {aboutItems.map((item, index) => (
            <div key={index} className={styles.block}>
              <div className={styles.iconWrapper}>{item.icon}</div>
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

export default AboutSection;
