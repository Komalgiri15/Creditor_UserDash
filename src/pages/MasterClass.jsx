import React from 'react'
import MasterHero from '../components/MasterHero'
import GameBanner from '../components/GameBanner'
import CommitToGrowth from '../components/CommitToGrowth'
import OptionMC from '../components/OptionMC'
import { MCmembership } from '../components/MCmembership'
import { MCwho } from '../components/MCwho'
import Navbar from '../components/navbar.jsx';
import Footer from '../components/Footer.jsx';


export const MasterClass = () => {
  return (
    <div>
    <Navbar />
    <MasterHero/>
    <GameBanner/>
    <CommitToGrowth/>
    <OptionMC/>
    <MCmembership/>
    <MCwho/>
    <Footer />
    </div>
  )
}
