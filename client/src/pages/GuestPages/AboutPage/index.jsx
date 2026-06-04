import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserAstronaut,
  FaBuilding,
  FaHandshake,
  FaFingerprint,
  FaSearch,
  FaFileSignature,
  FaCheckDouble,
  FaLightbulb,
  FaLock,
  FaBalanceScale,
} from 'react-icons/fa';
import styles from './AboutPage.module.sass';

const workflow = [
  {
    step: '01',
    icon: FaFingerprint,
    title: 'Digital Identity',
    desc: 'Users create detailed profiles. Models showcase parameters and portfolios; Agencies verify their credentials.',
  },
  {
    step: '02',
    icon: FaSearch,
    title: 'Smart Matching',
    desc: 'Our algorithms filter castings based on precise metrics (height, age, skills), ensuring relevant connections only.',
  },
  {
    step: '03',
    icon: FaCheckDouble,
    title: 'Direct Response',
    desc: 'Agencies review applicants instantly. Acceptances generate official invites, rejections provide respectful feedback.',
  },
  {
    step: '04',
    icon: FaFileSignature,
    title: 'Automated Documentation',
    desc: 'The system automatically generates PDF invites and contracts, removing the need for external paperwork.',
  },
];

const values = [
  {
    icon: FaBalanceScale,
    title: 'Radical Transparency',
    desc: 'No hidden fees, no ambiguous contracts. We believe that clear communication builds the strongest professional relationships.',
  },
  {
    icon: FaLock,
    title: 'Safety First',
    desc: 'The modeling world can be vulnerable. We prioritize verified identities and secure data handling to protect every user.',
  },
  {
    icon: FaLightbulb,
    title: 'Continuous Innovation',
    desc: 'Fashion evolves daily; so should the tools we use. We are constantly updating our stack to stay ahead of industry needs.',
  },
];

export default function AboutPage () {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Redefining the <br />
          <span className={styles.gradientText}>Casting Ecosystem.</span>
        </h1>
        <p className={styles.subtitle}>
          LipaX is not just a job board. It is a comprehensive management tool
          designed to digitize the workflow between Talent and Agency.
          Paperless. Seamless. Professional.
        </p>
        <div className={styles.heroButtons}>
          <a href='#story' className={styles.secondaryBtn}>
            Read Our Story
          </a>
        </div>
      </section>

      <section id='story' className={styles.storySection}>
        <div className={styles.storyContent}>
          <h2 className={styles.sectionTitle}>Who We Are</h2>
          <div className={styles.storyTextColumns}>
            <p>
              LipaX started with a simple observation: the modeling industry,
              despite being at the forefront of fashion and trends, was running
              on outdated technology. Endless email threads, lost PDFs, and
              manual sorting of candidates were slowing down creativity.
            </p>
            <p>
              We built LipaX to serve as the{' '}
              <strong>operating system for modern modeling</strong>. We don't
              represent models; we provide the infrastructure for agencies to
              find them and for models to present themselves professionally. We
              are the bridge between raw talent and industry opportunities.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.workflowSection}>
        <h2 className={styles.sectionTitle}>The Workflow</h2>
        <p className={styles.sectionDesc}>
          How LipaX turns chaos into structure.
        </p>

        <div className={styles.timeline}>
          {workflow.map((item, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.stepNumber}>{item.step}</div>
              <div className={styles.timelineContent}>
                <item.icon className={styles.timelineIcon} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.splitSection}>
        <div className={styles.card}>
          <div className={styles.cardIconBox}>
            <FaUserAstronaut />
          </div>
          <h3>For Talents</h3>
          <p className={styles.cardDesc}>
            Stop sending cold emails. Build a verified profile that works for
            you 24/7. Get notified when you match a casting perfectly.
          </p>
        </div>
        <div className={`${styles.card} ${styles.cardDark}`}>
          <div className={styles.cardIconBox}>
            <FaBuilding />
          </div>
          <h3>For Agencies</h3>
          <p className={styles.cardDesc}>
            Your inbox is for business, not filtering. Use our dashboard to
            manage hundreds of applicants, generate PDFs, and finalize bookings.
          </p>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className={styles.valuesHeader}>
          <h2 className={styles.sectionTitle}>Our Core Values</h2>
          <p className={styles.sectionDesc}>
            The principles that guide us when creating every page of our
            platform
          </p>
        </div>

        <div className={styles.valuesGrid}>
          {values.map((val, index) => (
            <div key={index} className={styles.valueItem}>
              <div className={styles.valueHeader}>
                <span className={styles.valueIndex}>0{index + 1}.</span>
                <val.icon className={styles.valueIcon} />
              </div>
              <h3>{val.title}</h3>
              <p>{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>100%</span>
          <span className={styles.statLabel}>Verified Users</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>0</span>
          <span className={styles.statLabel}>Paper Waste</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>Global</span>
          <span className={styles.statLabel}>Coverage</span>
        </div>
      </section>

      <section className={styles.cta}>
        <FaHandshake className={styles.ctaIcon} />
        <h2>Become part of the change.</h2>
        <p>
          Whether you are scouting or scouting for jobs, LipaX is your tool.
        </p>
        <Link to='/signup' className={styles.largeBtn}>
          Join the Platform
        </Link>
      </section>
    </div>
  );
}
