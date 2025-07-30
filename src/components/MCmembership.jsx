import React from 'react';
import { 
  FaBook, 
  FaGamepad, 
  FaVideo, 
  FaFileAlt, 
  FaMobileAlt, 
  FaComments, 
  FaListAlt, 
  FaGraduationCap,
  FaSitemap,
  FaBriefcase,
  FaBookOpen
} from 'react-icons/fa';

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const BenefitCard = ({ icon, title, description }) => (
  <div className="benefit-card">
    <div className="benefit-icon">
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export const MCmembership = () => {
  return (
    <div className="masterclass-container">
      {/* Masterclass Membership Section */}
      <section className="membership-section">
        <div className="section-header">
          <h2>Master Class Membership</h2>
          <p>From Public Confusion to <strong>Private Power</strong></p>
        </div>

        <div className="features-grid">
          <FeatureCard 
            icon={<FaBook size={30} color="#0056b3" />}
            title="65+ Core Lessons"
            description="Sovereignty, Trusts, Credit & More"
          />
          
          <FeatureCard 
            icon={<FaGamepad size={30} color="#0056b3" />}
            title="Law Simulation Games"
            description="Learn by Doing"
          />
          
          <FeatureCard 
            icon={<FaVideo size={30} color="#0056b3" />}
            title="24+ Live Classes"
            description="With Coach Paul Micheal"
          />
          
          <FeatureCard 
            icon={<FaFileAlt size={30} color="#0056b3" />}
            title="100+ Templates"
            description="Contracts, UCC, IRS Docs"
          />
          
          <FeatureCard 
            icon={<FaGraduationCap size={30} color="#0056b3" />}
            title="Smart Sovereign LMS"
            description="Avatar + AI Chatbot"
          />
          
          <FeatureCard 
            icon={<FaMobileAlt size={30} color="#0056b3" />}
            title="Mobile Access"
            description="24/7 Anywhere, Anytime"
          />
          
          <FeatureCard 
            icon={<FaComments size={30} color="#0056b3" />}
            title="Community + Support"
            description="Live Chat, Q&A, Threads"
          />
          
          <FeatureCard 
            icon={<FaListAlt size={30} color="#0056b3" />}
            title="Step-by-Step Roadmaps"
            description="From status to business mastery"
          />
          
          <FeatureCard 
            icon={<FaGraduationCap size={30} color="#0056b3" />}
            title="Private Masterclasses"
            description="Exclusive bonus content"
          />
        </div>
      </section>

      {/* Why Join Section */}
      <section className="why-join-section">
        <div className="section-header">
          <h2>Why Join the Master Class?</h2>
          <p>Structure. Identity. Financial Firepower.</p>
        </div>

        <div className="benefits-grid">
          <BenefitCard 
            icon={<FaSitemap size={60} color="#0056b3" />}
            title="Structured Roadmap"
            description="From American history to modern private ops — no fluff, just flow."
          />
          
          <BenefitCard 
            icon={<FaBriefcase size={60} color="#0056b3" />}
            title="Real Execution"
            description="Tools & steps that move you forward with private confidence."
          />
          
          <BenefitCard 
            icon={<FaBookOpen size={60} color="#0056b3" />}
            title="Core Foundation"
            description="Sovereignty, Trusts, Credit Building & Private Business Setup."
          />
          
          <BenefitCard 
            icon={<FaGamepad size={60} color="#0056b3" />}
            title="Interactive Training"
            description="Engaging games replace boring lectures — train through action."
          />
        </div>
      </section>

      <style jsx>{`
        .masterclass-container {
          font-family: 'Poppins', sans-serif;
        }
        
        .membership-section {
          padding: 60px 5%;
          background: linear-gradient(to bottom, #eef5ff, #ffffff);
        }
        
        .why-join-section {
          padding: 70px 6%;
          background: #eef5ff;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }
        
        .section-header h2 {
          font-size: 2.2rem;
          font-weight: bold;
          color: #0056b3;
          margin-bottom: 10px;
        }
        
        .section-header p {
          color: #595f66;
          font-size: 1rem;
        }
        
        .features-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 30px;
        }
        
        .benefits-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          justify-content: center;
        }
        
        .feature-card {
          background: #ffffff;
          width: 300px;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }
        
        .benefit-card {
          flex: 1 1 300px;
          background: #ffffff;
          border-radius: 14px;
          padding: 25px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.05);
          transition: transform 0.3s ease;
          text-align: center;
        }
        
        .benefit-card:hover {
          transform: translateY(-5px);
        }
        
        .feature-icon, .benefit-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          background: #eef5ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .feature-card h3, .benefit-card h3 {
          font-size: 1.1rem;
          color: #0056b3;
          margin-bottom: 8px;
        }
        
        .feature-card p, .benefit-card p {
          font-size: 0.9rem;
          color: #595f66;
        }
      `}</style>
    </div>
  );
};