import { motion } from 'framer-motion';
import { Users, Building2, Briefcase } from 'lucide-react';
import styles from './AboutSection.module.sass';

const AboutSection = () => {
  return (
    <section className={styles.about}>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <span className={styles.companyName}>About LipaX</span>
      </motion.h2>

      <motion.p
        className={styles.description}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
      >
        ModelPlatform is the next-generation ecosystem that connects models,
        agencies, and brands in one unified space. We help talents showcase
        their potential and provide businesses with the tools to discover new
        faces and collaborate seamlessly.
      </motion.p>

      <div className={styles.cards}>
        <motion.div
          className={styles.card}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Users className={styles.icon} />
          <h3>For Models</h3>
          <p>
            Build your portfolio, get discovered, and connect directly with
            trusted agencies and clients worldwide.
          </p>
        </motion.div>

        <motion.div
          className={styles.card}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Building2 className={styles.icon} />
          <h3>For Agencies</h3>
          <p>
            Manage your models, promote talent, and access a global network of
            brands and fashion events.
          </p>
        </motion.div>

        <motion.div
          className={styles.card}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Briefcase className={styles.icon} />
          <h3>For Clients</h3>
          <p>
            Find the perfect model for your campaign, shoot, or fashion event —
            quickly and efficiently.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
