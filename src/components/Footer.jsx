import React from 'react';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import { Link } from 'react-router-dom';
import TermCondition from '../pages/TermCondition';

const Footer = () => {
  return (
    <section style={{ background: '#5DADE2', color: '#fff', padding: '80px 10%', fontFamily: 'Poppins, sans-serif', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
        {/* Column 1: Legal & Policies */}
        <div style={{ flex: 1, minWidth: 250, marginBottom: 40, position: 'relative' }}>
          <h3
            style={{ fontSize: '2rem', marginBottom: 25, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10, position: 'relative' }}
            onMouseOver={() => (document.getElementById('underline1').style.width = '100%')}
            onMouseOut={() => (document.getElementById('underline1').style.width = '60px')}
          >
            {/* Shield Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l7 4v6c0 5.25-3.33 9.74-7 10-3.67-.26-7-4.75-7-10V6l7-4z"></path>
            </svg>
            Legal & Policies
            <span id="underline1" style={{ display: 'block', width: 60, height: 4, background: '#fff', position: 'absolute', bottom: -5, left: 30, transition: 'width 0.3s ease-in-out' }}></span>
          </h3>
          <p> <Link to="/privacy" style={{ color: '#fff', textDecoration: 'none' }} onClick={() => window.scrollTo(0,0)}>
    Privacy Policies
  </Link></p>
          <p> <Link to="/termcondition" style={{ color: '#fff', textDecoration: 'none' }} onClick={() => window.scrollTo(0,0)}>
    Terms and Condition
  </Link></p>
          <p><Link to="/ReturnRefund" style={{ color: '#fff', textDecoration: 'none' }} onClick={() => window.scrollTo(0,0)}>Return and Refunds</Link></p>
          <p><Link to="/MembershipTnC" style={{ color: '#fff', textDecoration: 'none' }} onClick={() => window.scrollTo(0,0)}>Membership Terms and Conditions</Link></p>
        </div>

        {/* Column 2: Contact Us */}
        <div style={{ flex: '1 1 0%', minWidth: 250, marginBottom: 40, position: 'relative' }}>
          <h3
            style={{ fontSize: '2rem', marginBottom: 25, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10, position: 'relative' }}
            onMouseOver={() => (document.getElementById('underline2').style.width = '100%')}
            onMouseOut={() => (document.getElementById('underline2').style.width = '60px')}
          >
            {/* Mail Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Contact Us
            <span id="underline2" style={{ display: 'block', width: 60, height: 4, background: '#fff', position: 'absolute', bottom: -5, left: 30, transition: 'width 0.3s ease-in-out' }}></span>
          </h3>
          <p><strong>Email:</strong> counselor@creditoracademy.com</p>
          <p><strong>Phone:</strong> (425-400-9246)</p>
          <p><strong>Operational hours:</strong> 9:00 AM to 5:00 PM EST</p>
        </div>

        {/* Column 3: Social Links */}
        <div style={{ flex: 1, minWidth: 250, marginBottom: 40, position: 'relative' }}>
          <h3
            style={{ fontSize: '2rem', marginBottom: 25, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10, position: 'relative' }}
            onMouseOver={() => (document.getElementById('underline3').style.width = '100%')}
            onMouseOut={() => (document.getElementById('underline3').style.width = '60px')}
          >
            {/* Users Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Social Links
            <span id="underline3" style={{ display: 'block', width: 60, height: 4, background: '#fff', position: 'absolute', bottom: -5, left: 30, transition: 'width 0.3s ease-in-out' }}></span>
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 25 }}>
            <a href="https://www.facebook.com/groups/1455118361753321/" style={{ color: '#fff' }} aria-label="Facebook">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12A10 10 0 1 0 12 22v-7h-2v-3h2v-2.3c0-2 1.2-3.2 3-3.2.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12z" />
              </svg>
            </a>
            <a href="https://x.com/CreditorAcademy" style={{ color: '#fff' }} aria-label="Twitter">
              <svg width="28" height="28" viewBox="0 0 512 512" fill="currentColor">
                <path d="M459.4 151.7c.3 4.1 .3 8.2 .3 12.3 0 125.6-95.5 270.5-270.5 270.5-53.8 0-103.9-15.6-146.1-42.4 7.4 .9 14.8 1.2 22.6 1.2 44.7 0 85.8-15.2 118.4-41.1-41.7-.7-76.8-28.3-89-66.1 5.8 .9 11.4 1.5 17.4 1.5 8.3 0 16.6-1.1 24.3-3.2-43.6-8.7-76.4-47.2-76.4-93.2v-1.2c12.7 7.1 27.4 11.4 43 11.9-25.4-17-42.2-45.8-42.2-78.6 0-17.2 4.6-33.1 12.7-46.8 46.5 57.1 116.2 94.5 194.7 98.4-1.6-6.9-2.5-14.1-2.5-21.5 0-52 42.1-94.2 94.2-94.2 27.1 0 51.6 11.4 68.8 29.7 21.5-4.1 41.7-12.1 59.8-23-7.1 22.3-22.3 41-42.1 52.8 19.2-2.2 37.5-7.4 54.5-15-12.6 18.9-28.5 35.4-46.9 48.7z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@creditoracademy" target="_blank" style={{ color: '#fff' }} aria-label="YouTube" rel="noopener">
              <svg width="28" height="28" viewBox="0 0 576 512" fill="currentColor">
                <path d="M549.7 124.1c-6.3-23.8-24.9-42.5-48.6-48.9C456.2 64 288 64 288 64s-168.2 0-213.1 11.2c-23.8 6.3-42.4 25.1-48.7 48.9C16 168.4 16 256 16 256s0 87.6 10.2 131.9c6.3 23.8 24.9 42.5 48.7 48.9C119.8 448 288 448 288 448s168.2 0 213.1-11.2c23.8-6.3 42.4-25.1 48.6-48.9C560 343.6 560 256 560 256s0-87.6-10.3-131.9zM232 336V176l142 80-142 80z" />
              </svg>
            </a>
            <a href="https://rumble.com/user/CreditorAcademy" target="_blank" style={{ color: '#fff' }} aria-label="Rumble" rel="noopener">
              <svg width="28" height="28" viewBox="0 0 400 400" fill="currentColor">
                <path d="M200 0C89.543 0 0 89.543 0 200s89.543 200 200 200 200-89.543 200-200S310.457 0 200 0zm53.8 276.4c-24.6 14.2-73.5-5.6-110.8-44.1-37.3-38.5-53.2-86.5-33.9-107.5 19.3-21 78.1-3.6 115.4 34.9 37.3 38.5 53.9 101.3 29.3 115.7zm-3.4-86.3c-7.4-8.4-17.1-15.3-27.9-20.1-16.2-7.2-32.3-8.2-41.3-2.7-7.3 4.4-9.4 11.7-6.4 20.6 3 8.9 10.4 18.1 20.3 25.4 13.4 9.9 28.6 15.1 40.6 13.7 7.2-.8 12.2-3.9 14.5-8.8 2.2-4.9 1.1-11.1-3.8-17.6z" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@creditoracademy" style={{ color: '#fff' }} aria-label="TikTok">
              <svg width="28" height="28" viewBox="0 0 256 256" fill="currentColor">
                <path d="M232 64.6c-23.7 0-43-18.2-45.3-41.4H152v120.7c0 21.8-17.7 39.5-39.5 39.5S73 165.7 73 143.9s17.7-39.5 39.5-39.5c1.4 0 2.8.1 4.2.2V80.5c-1.4-.1-2.8-.2-4.2-.2-35.1 0-63.6 28.5-63.6 63.6S77.4 207.5 112.5 207.5c35.1 0 63.6-28.5 63.6-63.6V97.5c13.1 10.5 29.7 16.7 47.9 16.7v-49.6z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ width: '100%', margin: '0 auto', padding: '0 16px', borderTop: '1px solid rgba(255,255,255,0.4)' }}>
        <p>© 2025 Creditor Academy. All rights reserved.</p>
      </div>
    </section>
  );
};

export default Footer;