import React from 'react';
import AboutSectionOP from '../components/AboutSectionOP.jsx';
import InfoOp from "../components/InfoOp.jsx";
import CoursesOP from "../components/CoursesOP.jsx";
import WhatYouBuild from '../components/WhatYouBuildOP.jsx';
import GameBanner from '../components/GameBanner.jsx';
import VideoOP from '../components/VideoOP.jsx';
import CourseEndAndTestimonials from '../components/CourseTestimonialsOP.jsx';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/navbar.jsx';

const OperatePrivate = () => {
  return (
    <div>
      <Navbar />
      <AboutSectionOP />
      <InfoOp />
      <CoursesOP />
      <WhatYouBuild />
      <GameBanner />
      <VideoOP />
      <CourseEndAndTestimonials />
      <Footer />

    </div>
  );
};

export default OperatePrivate;