import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CommitToGrowth = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [offerExpired, setOfferExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const nextMonth = new Date(currentYear, currentMonth + 1, 1);
      const endOfMonth = new Date(nextMonth.getTime() - 1000);
      const targetDate = new Date(`${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')} 23:59:59 PST`).getTime();
      const nowTime = new Date().getTime();
      const distance = targetDate - nowTime;

      if (distance < 0) {
        setOfferExpired(true);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days < 10 ? `0${days}` : days.toString(),
        hours: hours < 10 ? `0${hours}` : hours.toString(),
        minutes: minutes < 10 ? `0${minutes}` : minutes.toString(),
        seconds: seconds < 10 ? `0${seconds}` : seconds.toString()
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <GrowthSection>
      <SectionTitle>
        <span>Commit to Growth –</span> <Highlight>Pick 1 of 3 Limited Time Offers</Highlight>
      </SectionTitle>
      <SectionDescription>
        Sign up for a full year of Masterclass membership $828 annually and choose ONE of these powerful bonuses:
      </SectionDescription>

      <CountdownContainer>
        {offerExpired ? (
          <ExpiredMessage>Offer Expired!</ExpiredMessage>
        ) : (
          <>
            <CountdownHeader>⏳ Hurry! Offer Ends in:</CountdownHeader>
            <CountdownTimer>
              <TimeUnit>
                <TimeValue>{timeLeft.days}</TimeValue>
                <TimeLabel>Days</TimeLabel>
              </TimeUnit>
              <TimeUnit>
                <TimeValue>{timeLeft.hours}</TimeValue>
                <TimeLabel>Hours</TimeLabel>
              </TimeUnit>
              <TimeUnit>
                <TimeValue>{timeLeft.minutes}</TimeValue>
                <TimeLabel>Minutes</TimeLabel>
              </TimeUnit>
              <TimeUnit>
                <TimeValue>{timeLeft.seconds}</TimeValue>
                <TimeLabel>Seconds</TimeLabel>
              </TimeUnit>
            </CountdownTimer>
          </>
        )}
      </CountdownContainer>
    </GrowthSection>
  );
};

// Styled Components
const GrowthSection = styled.section`
  max-width: 1200px;
  margin: auto;
  padding: 40px 20px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;

  span {
    color: rgb(52, 73, 94);
  }
`;

const Highlight = styled.span`
  color: rgb(0, 86, 179);
`;

const SectionDescription = styled.p`
  max-width: 700px;
  margin: 0 auto 40px;
  font-size: 16px;
  color: #555;
  text-align: center;
`;

const CountdownContainer = styled.div`
  text-align: center;
  margin-bottom: 40px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const CountdownHeader = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #d32f2f;
  margin-bottom: 10px;
`;

const CountdownTimer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
`;

const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimeValue = styled.span`
  font-size: 24px;
`;

const TimeLabel = styled.p`
  font-size: 14px;
  color: #555;
  margin: 5px 0 0;
`;

const ExpiredMessage = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #d32f2f;
`;

export default CommitToGrowth;