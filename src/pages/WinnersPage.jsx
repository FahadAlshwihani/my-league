// src/pages/WinnersPage.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearLeagueSetup, clearLeagueMatches } from '../utils/storage';
import styled, { keyframes, css } from 'styled-components';
import { FaTrophy, FaMedal, FaHome } from 'react-icons/fa';
import { IoMdMedal } from 'react-icons/io';
import { useTranslation } from 'react-i18next';

const WinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: none;
  color: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  margin-top: 60px; /* 👈 Add this line */
  font-family: 'Montserrat', sans-serif; /* Default font */

  [lang="ar"] & {
    font-family: 'Tajawal', sans-serif; /* Arabic font */
  }
`;

const floating = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const WinnerTitle = styled.h1`
  font-size: clamp(1.5rem, 4vw, 3rem);
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;

  & span {
    color: #ffd700;
    animation: ${floating} 3s ease-in-out infinite;
  }
`;

const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 60vh;
  max-height: 400px;
  gap: 1rem;
  margin-bottom: 2rem;
  perspective: 1000px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
    height: auto;
  }
`;

const WinnerCard = styled.div`
  position: relative;
  width: 20%;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  border-radius: 1rem;
  background: ${props => props.$background};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out forwards;
  opacity: 0;
  animation-delay: ${props => props.$delay}s;

  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  }

  &::before {
    content: '';
    position: absolute;
    bottom: -10px;
    width: 90%;
    height: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    filter: blur(10px);
    z-index: -1;
  }

  @media (max-width: 768px) {
    width: 28%;
    min-width: 120px;
  }
`;

const Medal = styled.div`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  z-index: 2;
`;

const TeamName = styled.h2`
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  margin: 0.5rem 0;
  text-align: center;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Points = styled.p`
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  margin: 0;
  opacity: 0.9;
`;

const PositionBadge = styled.div`
  position: absolute;
  top: -15px;
  right: -15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  background: ${props => props.$background};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 3;
`;

const HomeButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 242, 254, 0.4);
    background: linear-gradient(90deg, #00f2fe 0%, #4facfe 100%);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const confettiFall = (x, y, rotateEnd) => keyframes`
  0% { transform: translate(${x}vw, ${y}vh) rotate(0deg); opacity: 1; }
  100% { transform: translate(${x + (Math.random() * 20 - 10)}vw, ${y + 100}vh) rotate(${rotateEnd}deg); opacity: 0; }
`;

const ConfettiPiece = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  opacity: 0;
  border-radius: 50%;
  animation: ${({ x, y, rotateEnd, delay }) => css`
    ${confettiFall(x, y, rotateEnd)} 3s ease-out forwards
  `};
  animation-delay: ${({ delay }) => delay}s;
  left: ${({ x }) => x}%;
  top: -20px;
`;

const fireworks = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
`;

const Firework = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color};
  animation: ${fireworks} 0.8s ease-out forwards;
  top: ${props => props.y}%;
  left: ${props => props.x}%;
  pointer-events: none;
`;

const sparkleAnim = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const Sparkle = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px white;
  animation: ${sparkleAnim} 2s infinite ease-in-out;
  top: ${props => props.y}%;
  left: ${props => props.x}%;
  pointer-events: none;
`;

const WinnersPage = ({ tournamentType }) => { // Accept tournamentType as a prop
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { standings } = location.state || { standings: [] };
  const [confetti, setConfetti] = useState([]);
  const [fireworksList, setFireworks] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const confettiId = useRef(0);

  const topThree = useMemo(() => standings.slice(0, 3), [standings]);

  useEffect(() => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    const generateConfetti = () => {
      const newConfetti = [];
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * -20;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = Math.random() * 1.5;
        const rotateEnd = 360 + Math.random() * 360;

        newConfetti.push(
          <ConfettiPiece
            key={confettiId.current++}
            color={color}
            x={x}
            y={y}
            delay={delay}
            rotateEnd={rotateEnd}
          />
        );
      }
      setConfetti(prev => [...prev, ...newConfetti].slice(-200));
    };

    const confettiInterval = setInterval(generateConfetti, 1000);
    generateConfetti();

    return () => clearInterval(confettiInterval);
  }, []);

  useEffect(() => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const interval = setInterval(() => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * 100;
      const y = Math.random() * 60;

      setFireworks(prev => [...prev, <Firework key={Date.now()} x={x} y={y} color={color} />]);

      setTimeout(() => {
        setFireworks(prev => prev.slice(1));
      }, 800);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const sparkleList = [];
    for (let i = 0; i < 20; i++) {
      sparkleList.push(<Sparkle key={i} x={Math.random() * 100} y={Math.random() * 100} />);
    }
    setSparkles(sparkleList);
  }, []);

  const handleGoHome = () => {
    clearLeagueSetup();
    clearLeagueMatches();
    navigate('/');
  };

  if (topThree.length === 0) {
    return (
      <WinnerContainer>
        <WinnerTitle>{t('Winner.Title1')}</WinnerTitle>
        <HomeButton onClick={handleGoHome}>
          <FaHome />
        </HomeButton>
      </WinnerContainer>
    );
  }

  return (
    <WinnerContainer>
      {confetti}
      {fireworksList}
      {sparkles}
      <WinnerTitle>
        <FaTrophy />
        {t('Winner.Title2')}
        <FaTrophy />
      </WinnerTitle>
      <PodiumContainer>
        {topThree[1] && (
          <WinnerCard
            $background="linear-gradient(135deg, #c0c0c0 0%, #d3d3d3 100%)"
            $delay={0.3}
            style={{ height: '200px' }}
          >
            <PositionBadge $background="#c0c0c0">2</PositionBadge>
            <Medal>
              <IoMdMedal style={{ color: '#c0c0c0' }} />
            </Medal>
            <TeamName>{topThree[1].team}</TeamName>
            {/* Conditionally render points based on tournament type */}
            {tournamentType !== 'knockout' && (
              <Points>
                {topThree[1].pts} {t('points.1')}
              </Points>
            )}
          </WinnerCard>
        )}
        {topThree[0] && (
          <WinnerCard
            $background="linear-gradient(135deg, #ffd700 0%, #ffcc00 100%)"
            $delay={0}
            style={{ height: '300px' }}
          >
            <PositionBadge $background="#ffd700">1</PositionBadge>
            <Medal>
              <FaMedal style={{ color: '#ffd700' }} />
            </Medal>
            <TeamName>{topThree[0].team}</TeamName>
            {/* Conditionally render points based on tournament type */}
            {tournamentType !== 'knockout' && (
              <Points>
                {topThree[0].pts} {t('points.1')}
              </Points>
            )}
          </WinnerCard>
        )}
        {topThree[2] && (
          <WinnerCard
            $background="linear-gradient(135deg, #cd7f32 0%, #d2b48c 100%)"
            $delay={0.6}
            style={{ height: '170px' }}
          >
            <PositionBadge $background="#cd7f32">3</PositionBadge>
            <Medal>
              <FaMedal style={{ color: '#cd7f32' }} />
            </Medal>
            <TeamName>{topThree[2].team}</TeamName>
            {/* Conditionally render points based on tournament type */}
            {tournamentType !== 'knockout' && (
              <Points>
                {topThree[2].pts} {t('points.1')}
              </Points>
            )}
          </WinnerCard>
        )}
      </PodiumContainer>
      <HomeButton onClick={handleGoHome}>
        <FaHome />
      </HomeButton>
    </WinnerContainer>
  );
};

export default WinnersPage;
