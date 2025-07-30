import React from 'react';
import BannerSophomore from '../components/BannerSophomore.jsx';
import HeroSophomore from '../components/HeroSophomore.jsx';
import LearnSophomore from '../components/LearnSophomore.jsx';
import StatusCorrectionSophomore from '../components/StatusCorrectionSophomore.jsx';
import GameBanner from '../components/GameBanner.jsx';
import VideoSophomore from '../components/VideoSophomore.jsx';
import OutcomeSophomore from '../components/OutcomeSophomore.jsx';
import TestimonialSophomore from '../components/TestimonialSophomore.jsx';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/navbar.jsx';
const Sophomore = () => {
  return (
    <div>
      <Navbar />
      <BannerSophomore />
      <HeroSophomore />
      <LearnSophomore />
      <StatusCorrectionSophomore />
      <GameBanner />
    <VideoSophomore />
        <OutcomeSophomore />
        <TestimonialSophomore />
        <Footer />
    </div>
  );
};

export default Sophomore;