import React from 'react'
import SOVhero from '../components/SOVhero';
import KeyLearning from '../components/KeyLearning';
import CoursesSOV from '../components/coursesSOV';
import GameBanner from '../components/GameBanner';
import SOVtestimonials from '../components/SOVtestimonials';
import JourneySOVpage from '../components/journeySOVpage';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/navbar.jsx';

const Sov = () => {
  return (
    <div>
        <Navbar />
        <SOVhero/>
        <KeyLearning/>
        <CoursesSOV/>
        <GameBanner/>
        <SOVtestimonials/>
        <JourneySOVpage/>
        <Footer />
    </div>
  );
};
export default Sov;
