import React from 'react';
import styled from 'styled-components';
import option1 from '../assets/option1.jpg';
import option2 from '../assets/option2.jpg';
import option3 from '../assets/option3.jpg';

const OptionMC = () => {
  const offers = [
    {
      image: option1,
      alt: "Option 1",
      title: "Option 1:",
      subtitle: "Extra Months On Us",
      description: "Get 2 additional months FREE — that's 14 months total for the price of 12.",
      savings: "($138 instant savings)",
      link: "https://quickclick.com/r/ylju71tqiulsto3pqq6w9mq9tbrnmn"
    },
    {
      image: option2,
      alt: "Option 2",
      title: "Option 2:",
      subtitle: "I Want Remedy Now!",
      description: "Get 50% off on 'I Want Remedy Now' Course. ($399 Cost).",
      savings: "($200 instant savings)",
      link: "https://quickclick.com/r/2ki208s0ma02pjgpkzsl1i7fy7pxot"
    },
    {
      image: option3,
      alt: "Option 3",
      title: "Option 3:",
      subtitle: "Cadillac Website, Get 50% Off on Setup Fee",
      description: "Launch your cadillac website for $499 down payment (normally $1,000 setup). Just pay $49 per month for system support and hosting.",
      savings: "($501 instant savings)",
      link: "https://quickclick.com/r/rb2jlzfzukvlhucyksh35imhlmu85c"
    }
  ];

  return (
    <OffersSection>
      <OffersContainer>
        {offers.map((offer, index) => (
          <OfferCard key={index}>
            <CardContent>
              <ImageContainer>
                <OfferImage src={offer.image} alt={offer.alt} />
              </ImageContainer>
              <OfferTitle>{offer.title}</OfferTitle>
              <OfferSubtitle>{offer.subtitle}</OfferSubtitle>
              <OfferDescription>{offer.description}</OfferDescription>
              <OfferSavings>{offer.savings}</OfferSavings>
              <JoinButton 
                href={offer.link} 
                target="_blank" 
                rel="noopener noreferrer"
                disabled
              >
                Join Now
              </JoinButton>
            </CardContent>
          </OfferCard>
        ))}
      </OffersContainer>
    </OffersSection>
  );
};

// Styled Components
const OffersSection = styled.section`
  padding: 40px 5%;
  background: #f9fcff;
  font-family: 'Segoe UI', sans-serif;
`;

const OffersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
  }
`;

const OfferCard = styled.section`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 20px;
  width: 100%;
  flex: 1 1 300px;
  max-width: 340px;
  text-align: center;
  display: flex;
  flex-direction: column;
`;


const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ImageContainer = styled.div`
  height: 180px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const OfferImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OfferTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const OfferSubtitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const OfferDescription = styled.p`
  font-size: 15px;
  color: #444;
`;

const OfferSavings = styled.p`
  font-size: 15px;
  color: #444;
  font-weight: bold;
`;

const JoinButton = styled.a`
  display: inline-block;
  padding: 10px 20px;
  background-color: #3bbcf8;
  color: white;
  border-radius: 20px;
  font-size: 15px;
  text-decoration: none;
  margin-top: auto;
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
`;

export default OptionMC;