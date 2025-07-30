import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import anyone from '../assets/anyone.jpg';
import businessOwner from '../assets/businessOwners.jpg';
import entrepreneurs from '../assets/entrepreneurs.jpg';
import sovereignty from '../assets/sovereignty.jpg';
import you from '../assets/you.jpg';

export const MCwho = () => {
  return (
    <>
      {/* Who Is This For? */}
      <section style={{ padding: '50px 5%', backgroundColor: '#ffffff', fontFamily: "'Poppins', sans-serif" }}>
        <h2 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '40px', textAlign: 'center' }}>
          <span style={{ color: 'rgb(0, 86, 179)' }}><strong>Who Is This For?</strong></span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <img src={sovereignty} alt="Sovereignty Seekers" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            <p style={{ fontSize: '1.1rem', color: '#34495e', marginTop: '15px' }}>Sovereignty Seekers ready to go private — the right way</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <img src={entrepreneurs} alt="Entrepreneurs" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            <p style={{ fontSize: '1.1rem', color: '#34495e', marginTop: '15px' }}>Entrepreneurs looking to operate outside the system</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <img src={businessOwner} alt="Business Owners" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            <p style={{ fontSize: '1.1rem', color: '#34495e', marginTop: '15px' }}>Business Owners needing trust-backed websites, EINs, and asset control</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <img src={anyone} alt="Anyone serious" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            <p style={{ fontSize: '1.1rem', color: '#34495e', marginTop: '15px' }}>Anyone serious about credit power and private wealth</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <img src={you} alt="You" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            <p style={{ fontSize: '1.1rem', color: '#34495e', marginTop: '15px' }}>You — if you're done with control and ready for ownership</p>
          </div>
        </div>
      </section>

      {/* What Our Members Say */}
      <section style={{ background: '#e6f0ff', padding: '80px 10%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '40px' }}>
          <span style={{ color: 'rgb(0, 86, 179)' }}><strong>What Our Members Say</strong></span>
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
          <div 
            style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              maxWidth: '320px', 
              border: '1px solid rgba(52, 152, 219, 0.3)', 
              boxShadow: '0 5px 15px rgba(52, 152, 219, 0.1)', 
              transition: 'transform 0.3s ease' 
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px', border: '3px solid #3498db' }}>
              <img src="https://randomuser.me/api/portraits/men/44.jpg" alt="Derrick" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <FaQuoteLeft style={{ position: 'absolute', top: '-30px', left: '-10px', opacity: '0.1', width: '40px', color: '#2c3e50' }} />
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontStyle: 'italic', color: '#34495e' }}>
                I secured $22,000 in business credit within 3 months.
              </p>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#3498db' }}>— Derrick M., Georgia</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} style={{ color: '#f1c40f', fontSize: '1.2rem' }} />
              ))}
            </div>
          </div>

          <div 
            style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              maxWidth: '320px', 
              border: '1px solid rgba(52, 152, 219, 0.3)', 
              boxShadow: '0 5px 15px rgba(52, 152, 219, 0.1)', 
              transition: 'transform 0.3s ease' 
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px', border: '3px solid #3498db' }}>
              <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Tina" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <FaQuoteLeft style={{ position: 'absolute', top: '-30px', left: '-10px', opacity: '0.1', width: '40px', color: '#2c3e50' }} />
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontStyle: 'italic', color: '#34495e' }}>
                I finally understood trusts. My private site launched without setup fees.
              </p>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#3498db' }}>— Tina L., Texas</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} style={{ color: '#f1c40f', fontSize: '1.2rem' }} />
              ))}
            </div>
          </div>

          <div 
            style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '15px', 
              maxWidth: '320px', 
              border: '1px solid rgba(52, 152, 219, 0.3)', 
              boxShadow: '0 5px 15px rgba(52, 152, 219, 0.1)', 
              transition: 'transform 0.3s ease' 
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px', border: '3px solid #3498db' }}>
              <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Justin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <FaQuoteLeft style={{ position: 'absolute', top: '-30px', left: '-10px', opacity: '0.1', width: '40px', color: '#2c3e50' }} />
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontStyle: 'italic', color: '#34495e' }}>
                I unlocked 5 courses just from playing. This is a training ground, not a school.
              </p>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#3498db' }}>— Justin A., Nevada</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} style={{ color: '#f1c40f', fontSize: '1.2rem' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{ padding: '60px 10%', background: '#fff', position: 'relative', zIndex: '1' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
          <div style={{ flex: '1 1 450px', maxWidth: '500px' }}>
            <iframe 
              style={{ width: '100%', height: '500px', border: 'none', borderRadius: '12px' }} 
              id="wonderengine-form" 
              src="https://api.wonderengine.ai/widget/form/o69tKOXv3NV8GnS4aGls?v=1" 
              title="Contact us form"
            ></iframe>
            <script src="https://api.wonderengine.ai/js/form_embed.js" type="text/javascript"></script>
          </div>
        </div>
      </section>

      {/* Doors Are Closing Soon */}
      <section style={{ padding: '100px 10%', background: 'radial-gradient(circle at top left, #d1eaff, #f0f9ff)', textAlign: 'center', fontFamily: "'Segoe UI', sans-serif", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,123,255,0.2), transparent)', borderRadius: '50%', zIndex: '0' }}></div>
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(0,123,255,0.1), transparent)', borderRadius: '50%', zIndex: '0' }}></div>
        <h2 style={{ fontSize: '2.8rem', background: 'linear-gradient(to right, #007BFF, #0056b3)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          <span style={{ fontSize: '24pt' }}><strong><span style={{ color: 'rgb(0, 86, 179)', fontFamily: 'Poppins, sans-serif' }}>Doors Are Closing Soon — Secure Your Spot</span></strong></span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', maxWidth: '1100px', margin: '20px auto' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#0056b3' }}><strong>Full Year of Training &amp; Tools</strong></h3>
            <p>Access comprehensive resources for a full year.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#0056b3' }}><strong>Pick One Life-Changing Bonus</strong></h3>
            <p>Choose a bonus to enhance your journey.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#0056b3' }}><strong>Games, Courses, Templates &amp; Live Sessions</strong></h3>
            <p>Engage with interactive learning tools and live support.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#0056b3' }}><strong>All for Just $69/month</strong></h3>
            <p>Affordable access to all course benefits.</p>
          </div>
        </div>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.open('https://www.creditoracademy.com/page/show/153616?portal_id=14800', '_blank');
          }}
          style={{ 
            display: 'inline-block', 
            padding: '18px 40px', 
            background: 'linear-gradient(135deg, #3498db, #5dade2)', 
            color: 'white', 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            borderRadius: '10px', 
            textDecoration: 'none', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)', 
            marginTop: '20px' 
          }}
          rel="noopener noreferrer"
        >
          Enroll Now
        </a>
      </section>
    </>
  );
};