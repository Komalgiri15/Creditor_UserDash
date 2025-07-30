import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const features = [
  {
    title: "Interactive Sessions",
    desc: "Ask questions and get real-time answers during our engaging sessions.",
    img: "https://img.freepik.com/premium-photo/live-button-with-play-icon-rendering_327483-180.jpg?w=740",
  },
  {
    title: "Expert Mentors",
    desc: "Learn from professionals with years of real-world experience.",
    img: "https://img.freepik.com/premium-photo/portrait-manager-man-with-arms-crossed-startup-success-teamwork-with-partnership-face-male-person-employee-with-leadership-collaboration-meeting-with-happiness-profit-growth_590464-187930.jpg?w=740",
  },
  {
    title: "Session Replays",
    desc: "Missed a class? No problem — access full replays anytime.",
    img: "https://img.freepik.com/premium-photo/three-people-are-sitting-front-tv-that-has-man-it_1286328-3032.jpg?w=740",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const LiveClassesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3, once: false });

  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const containerVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: i * 0.2,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div style={{ backgroundColor: "#f7f9fb", padding: "60px 20px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          maxWidth: "800px",
          margin: "auto",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ fontSize: "32px", marginBottom: "12px", color: "#111" }}>
          Why Join Our Live Classes?
        </h2>
        <p style={{ fontSize: "18px", color: "#555" }}>
          Get real-time answers to your questions, interact with experienced
          mentors, and build your skills through engaging sessions every week.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "25px",
          justifyContent: "center",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              scale: 1.03,
              rotate: 0.5,
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "300px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <img
              src={feature.img}
              alt={feature.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "15px",
              }}
            />
            <h3 style={{ fontSize: "20px", marginBottom: "10px", color: "#222" }}>
              {feature.title}
            </h3>
            <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.5" }}>
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LiveClassesSection;
