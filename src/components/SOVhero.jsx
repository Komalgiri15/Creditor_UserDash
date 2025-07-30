import React from 'react';
import { motion } from 'framer-motion';
import sovbanner from '../assets/Sov_101_football.png';

const SOVhero = () => {
  const handleButtonClick = () => {
    window.open('https://www.creditoracademy.com/page/show/153616?portal_id=14800', '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  const scaleUp = {
    hover: {
      scale: 1.05,
      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Banner */}
        <motion.div
          variants={fadeIn}
          style={{
            width: '100%',
            height: '450px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <img
            src={sovbanner}
            alt="Sovereignty 101 Banner"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              display: 'block',
              borderRadius: '8px',
              maxHeight: '420px'
            }}
          />
        </motion.div>

        {/* Sign Up Button */}
        <motion.div
          variants={itemVariants}
          style={{ textAlign: 'center', padding: '20px 0' }}
        >
          <motion.button
            variants={scaleUp}
            whileHover="hover"
            whileTap="tap"
            style={{
              display: 'inline-block',
              background: '#1890FF',
              color: 'white',
              padding: '18px 40px',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '1.3rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: 'none'
            }}
            onClick={handleButtonClick}
          >
            Sign up at $69/month
          </motion.button>
        </motion.div>

        {/* Title + Tagline */}
        <motion.div
          variants={containerVariants}
          style={{
            padding: '50px 10%',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: '2.8rem',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '10px'
            }}
          >
            <span style={{ color: 'rgb(0, 86, 179)' }}>Sovereignty 101:</span>{' '}
            <span style={{ color: 'rgb(52, 73, 94)' }}>
              The True American History They Hide from You
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: '1.4rem',
              fontWeight: '500',
              color: '#5dade2',
              marginBottom: '30px'
            }}
          >
            "Learn the Law. Know the Difference."
          </motion.p>
        </motion.div>

        {/* Course Introduction Video */}
        <motion.section
          variants={fadeIn}
          style={{
            padding: '80px 5%',
            background: 'linear-gradient(135deg, #e6f0ff, #f8fbff)',
            fontFamily: "'Segoe UI', sans-serif",
            textAlign: 'center'
          }}
        >
          <motion.h2
            variants={itemVariants}
            style={{
              fontSize: '2.5rem',
              color: '#1e293b',
              marginBottom: '20px'
            }}
          >
            <strong>
              <span style={{ color: 'rgb(0, 86, 179)' }}>Course Introduction Video</span>
            </strong>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: '1.15rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto 40px'
            }}
          >
            Take a quick look inside the Sovereignty 101 course — and discover what makes it unlike anything you've seen before.
          </motion.p>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '960px',
              margin: '0 auto',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
            }}
          >
            <div style={{ position: 'relative', paddingTop: '56.25%', height: '0' }}>
              <iframe
                width="560"
                height="314"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                src="https://drive.google.com/file/d/1QTHHHN1sHxigRdkXnyIX9eZ8Gr4gNBAq/preview"
                title="Sovereignty 101 Course Introduction"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </motion.section>
      </motion.div>

      {/* Responsive styles */}
      <style>
        {`
          @media (max-width: 768px) {
            h1 {
              font-size: 1.7rem !important;
            }

            p {
              font-size: 1rem !important;
            }

            button {
              padding: 14px 24px !important;
              font-size: 1rem !important;
            }

            section {
              padding: 40px 4% !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default SOVhero;
