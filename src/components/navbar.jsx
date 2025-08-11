import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from '../assets/creditorlogo.png';
import AdminModal from './AdminModal';
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [scrolled, setScrolled] = useState(false);

  const coursesTimeoutRef = useRef(null);
  const servicesTimeoutRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCoursesEnter = () => {
    clearTimeout(coursesTimeoutRef.current);
    setShowCourses(true);
  };
  const handleCoursesLeave = () => {
    coursesTimeoutRef.current = setTimeout(() => setShowCourses(false), 150);
  };
  const handleServicesEnter = () => {
    clearTimeout(servicesTimeoutRef.current);
    setShowServices(true);
  };
  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => setShowServices(false), 150);
  };
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMobile && isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen, isMobile]);

  const handleLoginClick = (e) => {
    e.preventDefault();
    // Always navigate to login page - UserContext will handle authentication state
    navigate("/login");
  };

  const loginButton = (isMobileView = false) => (
    <a
      href="#"
      onClick={handleLoginClick}
      className={`nav-login-btn${isMobileView ? ' mobile' : ''}`}
    >Login</a>
  );

  return (
    <>
      <header className={`nav-root${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo-wrap">
          {isMobile && (
            <button onClick={toggleMenu} className="nav-menu-btn" aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#59b7ff">
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2.5" strokeLinecap="round" />
                )}
              </svg>
            </button>
          )}
          <Link to="/" className="nav-logo-link">
            <img src={logo} alt="Creditor Academy" className="nav-logo" />
          </Link>
        </div>
        {!isMobile && (
          <nav className="nav-main-menu">
            <div
              className="nav-dropdown-wrap"
              onMouseEnter={handleCoursesEnter}
              onMouseLeave={handleCoursesLeave}
            >
              <span className="nav-link cool-underline">Courses ▾</span>
              <div className={`nav-dropdown${showCourses ? ' visible' : ''}`}>
                <NavLink to="/sov" className="nav-dropdown-link cool-underline">FRESHMAN: Sovereignty 101</NavLink>
                <NavLink to="/sophomore" className="nav-dropdown-link cool-underline">SOPHOMORE: Become Private</NavLink>
                <NavLink to="/operateprivate" className="nav-dropdown-link cool-underline">JUNIOR: Operate Private</NavLink>
                <NavLink to="/unlimitedcredit" className="nav-dropdown-link cool-underline">SENIOR: PRIVATE BUSINESS CREDIT</NavLink>
                <NavLink to="/remedy" className="nav-dropdown-link cool-underline">I WANT REMEDY NOW!</NavLink>
                <NavLink to="/privatemerchant" className="nav-dropdown-link cool-underline">Private Merchant & Processing</NavLink>

              </div>
            </div>
            <div
              className="nav-dropdown-wrap"
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <span className="nav-link cool-underline">Services ▾</span>
              <div className={`nav-dropdown${showServices ? ' visible' : ''}`}>
                <NavLink to="/liveclass" className="nav-dropdown-link cool-underline">Live Class</NavLink>
                <NavLink to="/website" className="nav-dropdown-link cool-underline">Website Creation</NavLink>
                <NavLink to="/pmp" className="nav-dropdown-link cool-underline">Merchant Processing</NavLink>

              </div>
            </div>
            <NavLink to="/masterclass" className="nav-link cool-underline">Membership</NavLink>
            <NavLink to="/contact" className="nav-link cool-underline">Contact</NavLink>
            <NavLink to="/remedy" className="nav-link cool-underline">Remedy NOW</NavLink>
            {loginButton()}
          </nav>
        )}

        {isMobile && loginButton(true)}

        {isMobile && isMenuOpen && (
          <div className="nav-mobile-menu">
            <div className="nav-mobile-dropdown">
              <button
                onClick={() => setShowCourses(!showCourses)}
                className="nav-mobile-dropdown-btn"
              >
                Courses {showCourses ? '▴' : '▾'}
              </button>
              {showCourses && (
                <div className="nav-mobile-dropdown-content">
                  <NavLink to="/sov" className="nav-mobile-link cool-underline" onClick={toggleMenu}>FRESHMAN: Sovereignty 101</NavLink>
                  <NavLink to="/sophomore" className="nav-mobile-link cool-underline" onClick={toggleMenu}>SOPHOMORE: Become Private</NavLink>
                  <NavLink to="/operateprivate" className="nav-mobile-link cool-underline" onClick={toggleMenu}>JUNIOR: Operate Private</NavLink>
                  <NavLink to="/unlimitedcredit" className="nav-mobile-link cool-underline" onClick={toggleMenu}>SENIOR: PRIVATE BUSINESS CREDIT</NavLink>
                  <NavLink to="/remedy" className="nav-mobile-link cool-underline" onClick={toggleMenu}>I WANT REMEDY NOW!</NavLink>
                  <NavLink to="/privatemerchant" className="nav-mobile-link cool-underline" onClick={toggleMenu}>Private Merchant & Processing</NavLink>
                </div>
              )}
            </div>
            <div className="nav-mobile-dropdown">
              <button
                onClick={() => setShowServices(!showServices)}
                className="nav-mobile-dropdown-btn"
              >
                Services {showServices ? '▴' : '▾'}
              </button>
              {showServices && (
                <div className="nav-mobile-dropdown-content">
                  <NavLink to="/liveclass"   className="nav-mobile-link cool-underline" onClick={toggleMenu}>Live Class</NavLink>
                  <NavLink to="/website" className="nav-mobile-link cool-underline" onClick={toggleMenu}>Website Creation</NavLink>
                  <NavLink to="/pmp" className="nav-mobile-link cool-underline" onClick={toggleMenu}>Merchant Processing</NavLink>
                </div>
              )}
            </div>
            <NavLink to="/masterclass" className="nav-mobile-link cool-underline" onClick={toggleMenu}>Membership</NavLink>
            <NavLink to="/contact" className="nav-mobile-link cool-underline" onClick={toggleMenu}>Contact</NavLink>
            <NavLink to="/remedy" className="nav-mobile-link cool-underline" onClick={toggleMenu}>Remedy NOW</NavLink>
          </div>
        )}
      </header>
      <AdminModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Navbar;
