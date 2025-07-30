import React from 'react';
import stater from '../assets/stater.jpg';
import cadillac from '../assets/cadillac.jpg';
import websiteDevelopment from '../assets/websiteDevelopment.jpg';
import SEOready from '../assets/SEOready.jpg';
import mobileOptimized from '../assets/mobileOptimized.jpg';
import CustomBrand from '../assets/CustomBrand.jpg';
import Ongoing from '../assets/Ongoing.jpg';
import SecureHosting from '../assets/SecureHosting.jpg';
import FastLoading from '../assets/FastLoadingg.jpg';

const WebsiteUpperSection = () => {
  return (
    <>
      {/* Banner Section */}
      <section style={{ position: 'relative', width: '100%', height: '90vh', maxHeight: '800px', minHeight: '600px', overflow: 'hidden', marginBottom: '60px' }}>
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)', zIndex: '1' }}></div>
        <img 
          src="https://www.creditoracademy.com/files/8178604/Website_Creation(2).jpg?lmsauth=b4e18bc1fed0208b641bf66a778d622326a86a75" 
          alt="Website Banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.9)' }} 
        />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '90%', maxWidth: '1000px', zIndex: '2', padding: '30px' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#fff', fontWeight: '800', marginBottom: '20px', fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.5px' }}>
            Launch Your Private <span style={{ background: 'linear-gradient(to right, #62cff4, #30a1e3)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Dream Website</span> Today
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.9)', marginBottom: '30px', fontFamily: "'Inter', sans-serif", lineHeight: '1.6' }}>
            <span style={{ color: 'rgb(255, 255, 255)' }}>Elevate your brand with a stunning, high-performance website designed for success.</span>
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
            <a 
              href="https://www.creditoracademy.com/contact_visitor" 
              style={{ display: 'inline-block', background: 'linear-gradient(to right, #3498db, #2980b9)', color: 'white', padding: '18px 48px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none', border: '2px solid transparent', transition: 'all 0.4s ease', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}
              onMouseOver={(e) => { e.target.style.transform = 'translateY(-5px)'; e.target.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)'; }}
              onMouseOut={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
            >
              Enroll Now!
            </a>
          </div>
        </div>
      </section>

      {/* Website Creation Plans Section */}
      <section style={{ padding: '50px 5%', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif", background: '#ffffff', position: 'relative' }}>
        <div style={{ background: 'linear-gradient(to bottom, #e6f3ff, #ffffff)', padding: '60px 20px', textAlign: 'center', fontFamily: "'Poppins', sans-serif", color: '#333' }}>
          <h2 style={{ fontSize: '36px', color: '#0056b3', fontWeight: 'bold', marginBottom: '10px' }}>Your Online Presence Starts Here</h2>
          <p style={{ fontSize: '18px', color: '#595f66', marginBottom: '50px' }}>Choose from Budget-Friendly Starter to High-End Templates</p>
          
          <div style={{ maxWidth: '1200px', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
            {/* Basic Website Card */}
            <div style={{ flex: '1 1 300px', background: '#ffffff', borderRadius: '16px', padding: '0', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease', overflow: 'hidden' }}>
              <img 
                src={stater} 
                alt="Starter Website" 
                style={{ width: '100%', display: 'block', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: 'auto' }}
              />
              <div style={{ padding: '30px' }}>
                <h3 style={{ color: '#008080', fontSize: '22px', fontWeight: 'bold', marginBottom: '12px' }}>STARTER WEBSITE</h3>
                <div style={{ height: '3px', width: '60px', background: '#0056b3', margin: '6px auto 20px auto' }}></div>
                <p style={{ fontSize: '17px', fontWeight: '600', color: '#111', marginBottom: '12px' }}>Launch Your Dream Website with Ease</p>
                <p style={{ fontSize: '16px', color: '#333', marginBottom: '20px' }}>
                  Get the starter Plan <span style={{ color: 'rgb(31, 122, 224)', fontWeight: '600', fontSize: '14pt' }}>@ $100</span>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <a 
                    href="https://digi-market-simple.vercel.app/" 
                    style={{ padding: '10px 20px', background: '#008080', color: 'white', fontWeight: '600', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => { e.target.background = '#006666'; e.target.transform = 'scale(1.1)'; }}
                    onMouseOut={(e) => { e.target.background = '#008080'; e.target.transform = 'scale(1)'; }}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    DEMO STARTER TEMPLATE
                  </a>
                  <a 
                    href="https://quickclick.com/r/mq0rtcnac7tng6qnl2wk009ddrgrly" 
                    style={{ marginLeft: '10px', padding: '10px 20px', background: '#1f7ae0', color: 'white', fontWeight: '600', borderRadius: '25px', textDecoration: 'none', transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => { e.target.background = '#0056b3'; e.target.transform = 'scale(1.1)'; }}
                    onMouseOut={(e) => { e.target.background = '#1f7ae0'; e.target.transform = 'scale(1)'; }}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    PAY NOW
                  </a>
                </div>
              </div>
            </div>

            {/* Cadillac Website Card */}
            <div style={{ flex: '1 1 300px', background: '#ffffff', borderRadius: '16px', padding: '0', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease', overflow: 'hidden' }}>
              <img 
                src={cadillac} 
                alt="Cadillac Website" 
                style={{ width: '100%', display: 'block', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: 'auto' }}
              />
              <div style={{ padding: '30px' }}>
                <h3 style={{ color: '#8e44ad', fontSize: '22px', fontWeight: 'bold', marginBottom: '12px' }}>CADILLAC WEBSITE</h3>
                <div style={{ height: '3px', width: '60px', background: '#0056b3', margin: '6px auto 20px auto' }}></div>
                <p style={{ fontSize: '17px', fontWeight: '600', color: '#111', marginBottom: '12px' }}>Professional Websites, Tailored to Your Vision</p>
                <p style={{ fontSize: '16px', color: '#333', marginBottom: '20px' }}>
                  Get the Cadillac website <span style={{ color: 'rgb(31, 122, 224)', fontWeight: '600', fontSize: '14pt' }}>@ $1000</span>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <a 
                    href="https://rhythmic-vibe.vercel.app/" 
                    style={{ padding: '10px 20px', background: '#8e44ad', color: 'white', fontWeight: '600', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => { e.target.background = '#732d91'; e.target.transform = 'scale(1.1)'; }}
                    onMouseOut={(e) => { e.target.background = '#8e44ad'; e.target.transform = 'scale(1)'; }}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    DEMO CADILLAC TEMPLATE
                  </a>
                  <a 
                    href="https://quickclick.com/r/ktwk1pon618kihkfhnfioqm9n1caap" 
                    style={{ marginLeft: '10px', padding: '10px 20px', background: '#1f7ae0', color: 'white', fontWeight: '600', borderRadius: '25px', textDecoration: 'none', transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => { e.target.background = '#0056b3'; e.target.transform = 'scale(1.1)'; }}
                    onMouseOut={(e) => { e.target.background = '#1f7ae0'; e.target.transform = 'scale(1)'; }}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    PAY NOW
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Website Development & Design Section */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '40px', marginTop: '50px', fontFamily: "'Poppins', sans-serif" }}>
          {/* Left Content */}
          <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#1a202c', marginBottom: '20px', fontWeight: 'bold' }}>
              Website <span style={{ color: '#5dade2', background: 'linear-gradient(90deg, #5dade2, #2a9d8f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Development & Design</span>
            </h2>
            
            <div style={{ display: 'inline-block', background: 'rgba(42, 157, 143, 0.1)', padding: '12px 30px', borderRadius: '50px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease' }}
              onMouseOver={(e) => { e.target.style.transform = 'translateY(-3px)'; }}
              onMouseOut={(e) => { e.target.style.transform = 'none'; }}
            >
              <p style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.8rem)', color: 'rgb(42, 157, 143)', fontWeight: '600', margin: '0', textAlign: 'center' }}>
                <span style={{ color: '#1a202c' }}>$100</span> One-Time Setup <span style={{ color: '#1a202c' }}>+ $49/month</span> Maintenance
              </p>
            </div>
            
            <p style={{ fontSize: '1.1rem', color: '#4a5568', marginTop: '30px', lineHeight: '1.7' }}>
              Transform your online presence with a custom, responsive website that aligns with your brand and drives business growth. From startups to established companies, we create digital experiences that captivate and convert.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '30px', marginBottom: '30px' }}>
              <span 
                style={{ background: '#e6f7ff', color: '#5dade2', padding: '10px 22px', borderRadius: '50px', fontSize: '0.95rem', fontWeight: '600', boxShadow: '0 3px 10px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'; }}
                onMouseOut={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 3px 10px rgba(0,0,0,0.03)'; }}
              >
                Mobile-First Design
              </span>
              <span 
                style={{ background: '#e6f7ff', color: '#5dade2', padding: '10px 22px', borderRadius: '50px', fontSize: '0.95rem', fontWeight: '600', boxShadow: '0 3px 10px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'; }}
                onMouseOut={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 3px 10px rgba(0,0,0,0.03)'; }}
              >
                SEO Optimized
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div style={{ flex: '1 1 300px', minWidth: '300px', maxWidth: '500px', marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}>
            <img 
              src={websiteDevelopment} 
              alt="Responsive Design" 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
            />
          </div>
        </div>

        {/* Title and Introduction */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#1a202c', fontWeight: '800', fontFamily: "'Poppins', sans-serif", marginBottom: '20px' }}>
            Powerful Private <span style={{ color: '#5dade2', background: 'linear-gradient(90deg, #5dade2, #2a9d8f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Website Features</span>
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#4a5568', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
            Every website we build comes packed with top-tier features that enhance user experience, boost visibility, and ensure performance.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {/* Feature Item - Custom Brand */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', background: '#fff' }}>
            <img 
              src={CustomBrand} 
              alt="Custom Brand-Aligned Designs" 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#2a9d8f', fontWeight: 'bold', marginBottom: '10px' }}>✓ Custom Brand-Aligned Designs</h3>
              <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: '1.6' }}>Crafted to reflect your unique business identity and values with modern aesthetics.</p>
            </div>
          </div>

          {/* Feature Item - Mobile Optimized */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', background: '#fff' }}>
            <img 
              src={mobileOptimized} 
              alt="Mobile-Optimized & Responsive" 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#2a9d8f', fontWeight: 'bold', marginBottom: '10px' }}>✓ Mobile-Optimized & Responsive</h3>
              <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: '1.6' }}>Ensures your site looks great and functions flawlessly on all screen sizes.</p>
            </div>
          </div>

          {/* Feature Item - SEO Ready */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', background: '#fff' }}>
            <img 
              src={SEOready} 
              alt="SEO-Ready Build" 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#2a9d8f', fontWeight: 'bold', marginBottom: '10px' }}>✓ SEO-Ready Build</h3>
              <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: '1.6' }}>Optimized to rank higher on search engines and attract targeted traffic.</p>
            </div>
          </div>

          {/* Feature Item - Fast Loading */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', background: '#fff' }}>
            <img 
              src={FastLoading} 
              alt="Fast Loading" 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#2a9d8f', fontWeight: 'bold', marginBottom: '10px' }}>✓ Fast Loading Speed</h3>
              <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: '1.6' }}>Blazing-fast performance with optimized images, scripts, and caching.</p>
            </div>
          </div>

          {/* Feature Item - Secure Hosting */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', background: '#fff' }}>
            <img 
              src={SecureHosting} 
              alt="Secure Hosting" 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#2a9d8f', fontWeight: 'bold', marginBottom: '10px' }}>✓ Secure Hosting</h3>
              <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: '1.6' }}>Reliable servers, free SSL, and automatic daily backups included.</p>
            </div>
          </div>

          {/* Feature Item - Ongoing Support */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', background: '#fff' }}>
            <img 
              src={Ongoing} 
              alt="Maintenance Support" 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#2a9d8f', fontWeight: 'bold', marginBottom: '10px' }}>✓ Ongoing Support & Maintenance</h3>
              <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: '1.6' }}>Hands-off peace of mind with updates, bug fixes, and priority support.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WebsiteUpperSection;