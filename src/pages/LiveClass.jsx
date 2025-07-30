import LiveClassSection from "../components/ClassLC";
import AboutLC from "../components/AboutLC";
import Navbar from '../components/navbar.jsx';
import Footer from '../components/Footer.jsx';

const LiveClass = () => {
  return (
    <div>
        <Navbar />
        <LiveClassSection />
        <AboutLC />
        <Footer />
    </div>
  );
};

export default LiveClass;