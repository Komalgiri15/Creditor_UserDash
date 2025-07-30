import React from 'react';
import { motion } from 'framer-motion';
import masterclassBanner from '../assets/masterclass_football.png';
import './MasterclassBanner.css';

const MasterclassBanner = () => {
  return (
    <section className="masterclass-hero-section">
      <div className="masterclass-hero-wrapper">

        {/* Banner Image */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: false, amount: 0.3 }}
          className="masterclass-hero-image-container"
        >
          <img
            src={masterclassBanner}
            alt="Masterclass Banner"
            className="masterclass-hero-image"
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: false, amount: 0.3 }}
          className="masterclass-hero-text"
        >
          <p className="masterclass-hero-subtitle">
            <span className="highlight-word">Everything</span> You Need to Go <span className="highlight-word">Private</span> — All in One Place
          </p>

          <a
            href="https://www.creditoracademy.com/page/show/152454?portal_id=14800"
            className="masterclass-hero-button"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MasterclassBanner;
