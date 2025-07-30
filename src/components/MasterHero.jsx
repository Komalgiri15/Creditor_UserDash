import React from 'react';
import styled from 'styled-components';
import masterclassMembership from '../assets/masteclassmembership.png';


const MasterHero = () => {
  const handleSignUp = () => {
    window.open('https://www.creditoracademy.com/page/show/153616?portal_id=14800', '_blank');
  };

  return (
    <>
      {/* Full-Width Banner */}
      <BannerContainer>
        <BannerImage src={masterclassMembership} alt="Masterclass Banner" />
      </BannerContainer>

      {/* Enroll Now Button */}
      <ButtonContainer>
        <SignUpButton onClick={handleSignUp}>
          Sign up at $69/month
        </SignUpButton>
      </ButtonContainer>

      {/* Course Introduction Video */}
      <VideoSection>
        <SectionTitle>
          <span>Inside the Creditors Academy</span>{' '}
          <Highlight>Master Class</Highlight>
        </SectionTitle>
        <SectionDescription>
          See what's possible when structure meets strategy. This short walkthrough shows the power of going private — the right way.
        </SectionDescription>
        
        <VideoContainer>
          <VideoWrapper>
            <iframe 
              src="https://drive.google.com/file/d/1KKlV8_rSO7eW0oMmPRUjc6tuf-X4bUnL/preview" 
              frameBorder="0"
              allow="autoplay; encrypted-media" 
              allowFullScreen
              title="Creditors Academy Master Class Walkthrough"
            />
          </VideoWrapper>
        </VideoContainer>
      </VideoSection>
    </>
  );
};

// Styled Components
const BannerContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
`;

const BannerImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const ButtonContainer = styled.div`
  text-align: center;
  padding: 20px 0;
`;

const SignUpButton = styled.button`
  display: inline-block;
  background: #1890FF;
  color: white;
  padding: 18px 40px;
  text-decoration: none;
  border-radius: 10px;
  font-size: 1.3rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  cursor: pointer;
  border: none;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  }
`;

const VideoSection = styled.section`
  padding: 80px 5%;
  background: linear-gradient(135deg, #e6f0ff, #f8fbff);
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 20px;

  span {
    color: rgb(52, 73, 94);
  }
`;

const Highlight = styled.span`
  color: rgb(0, 86, 179);
`;

const SectionDescription = styled.p`
  font-size: 1.15rem;
  color: #475569;
  max-width: 700px;
  margin: 0 auto 40px;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export default MasterHero;