import React from 'react';
import PrivateMerchantBanner from '../components/PrivateMerchantBanner';
import PrivateMerchantSection from '../components/PrivateMerchantSection';
import ComparisonSectionPM from '../components/ComparisionSectionPM';
import CourseModulesPM from '../components/CourseModulePM';
import CoursePM from '../components/CoursePM';
import WhatYouWillLearn from '../components/WhatYouWillRun';
import CourseUnlocks from '../components/CourseUnlocks';
import GameBanner from '../components/GameBanner';
import PaymentCTA from '../components/PaymentCTApm';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/navbar.jsx';

const PrivateMerchant = () => {
  return (
    <div>
      <Navbar />
      <PrivateMerchantBanner />
      <PrivateMerchantSection />
      <ComparisonSectionPM />
      <CourseModulesPM />
      <GameBanner/>
      <CoursePM />
      <WhatYouWillLearn />
      <CourseUnlocks />
      <PaymentCTA/>
      <Footer />
    </div>
  );
};

export default PrivateMerchant;
