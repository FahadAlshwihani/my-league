// src/pages/AboutMePage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { FaFutbol, FaUser , FaShareAlt, FaComments } from 'react-icons/fa';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 5px var(--glow-color-light); }
  50% { text-shadow: 0 0 15px var(--glow-color-dark), 0 0 25px var(--glow-color-dark); }
  100% { text-shadow: 0 0 5px var(--glow-color-light); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled Components for a modern UI
const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  color: var(--text-color);
  text-align: center;
  padding: 80px 2rem 2rem 2rem; /* Added top padding for header space */
  background: var(--background);
  animation: ${fadeIn} 1s ease-out;
  overflow: hidden; // Ensure no overflow from animations
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 1.5rem;
  color: var(--text-color);
  font-weight: 700;
  animation: ${slideInLeft} 0.8s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
  position: relative;
  display: inline-block;
  font-family: ${({ lang }) => (lang === 'ar' ? "'Tajawal', sans-serif" : "'Montserrat', sans-serif")}; // Conditional font-family

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    transform: translateX(-50%);
    width: 80%;
    height: 4px;
    background: linear-gradient(90deg, #64dcff, #00f2fe);
    border-radius: 2px;
    animation: ${fadeIn} 1s ease-out forwards;
    animation-delay: 0.5s;
    opacity: 0;
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  max-width: 800px;
  line-height: 1.8;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 0.4s;
  opacity: 0;
  color: var(--text-color);
  font-family: ${({ lang }) => (lang === 'ar' ? "'Tajawal', sans-serif" : "'Montserrat', sans-serif")}; // Conditional font-family
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.5rem, 3.5vw, 2.5rem);
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  color: #00f2fe;
  font-weight: 600;
  animation: ${slideInRight} 0.8s ease-out forwards;
  animation-delay: 0.6s;
  opacity: 0;
  text-shadow: 0 0 8px rgba(0, 242, 254, 0.6);
  font-family: ${({ lang }) => (lang === 'ar' ? "'Tajawal', sans-serif" : "'Montserrat', sans-serif")}; // Conditional font-family
`;

const Paragraph = styled.p`
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  max-width: 700px;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: ${props => props.$delay || '0.8s'};
  opacity: 0;
  color: var(--text-color);
  font-family: ${({ lang }) => (lang === 'ar' ? "'Tajawal', sans-serif" : "'Montserrat', sans-serif")}; // Conditional font-family
`;

const Highlight = styled.span`
  color: #00f2fe;
  font-weight: 600;
  animation: ${glow} 2s infinite alternate;
  --glow-color-light: rgba(0, 242, 254, 0.4);
  --glow-color-dark: rgba(0, 242, 254, 0.8);
`;

const Signature = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  margin-top: 3rem;
  font-weight: 600;
  color: #64dcff;
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 1.5s;
  opacity: 0;
  font-family: ${({ lang }) => (lang === 'ar' ? "'Tajawal', sans-serif" : "'Montserrat', sans-serif")}; // Conditional font-family
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`;

const IconWrapper = styled.div`
  margin: 0 1rem;
  font-size: 2.5rem;
  color: #00f2fe;
  animation: ${bounce} 1.5s infinite;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.2);
  }
`;

export default function AboutMePage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';  

  return (
    <AboutContainer dir={currentLang === 'ar' ? 'rtl' : 'ltr'} lang={currentLang}>
      <Title lang={currentLang}>{t('aboutMe.welcomeTitle')}</Title>
      <Subtitle lang={currentLang}>{t('aboutMe.intro')}</Subtitle>

      <IconContainer>
        <IconWrapper>
          <FaUser  />
        </IconWrapper>
        <IconWrapper>
          <FaFutbol />
        </IconWrapper>
        <IconWrapper>
          <FaShareAlt />
        </IconWrapper>
        <IconWrapper>
          <FaComments />
        </IconWrapper>
      </IconContainer>

      <SectionTitle lang={currentLang}>{t('aboutMe.inspirationTitle')}</SectionTitle>
      <Paragraph lang={currentLang} $delay="1s">{t('aboutMe.inspirationText1')}</Paragraph>
      <Paragraph lang={currentLang} $delay="1.2s">{t('aboutMe.inspirationText2')}</Paragraph>

      <SectionTitle lang={currentLang}>{t('aboutMe.featuresTitle')}</SectionTitle>
      <Paragraph lang={currentLang} $delay="1.4s">
        {t('aboutMe.featuresText1')} <Highlight>{t('aboutMe.featuresHighlight1')} </Highlight>
        {t('aboutMe.featuresText2')} <Highlight>{t('aboutMe.featuresHighlight2')} </Highlight>
        {t('aboutMe.featuresText3')}
      </Paragraph>
      <Paragraph lang={currentLang} $delay="1.6s">{t('aboutMe.featuresText4')}</Paragraph>

      <SectionTitle lang={currentLang}>{t('aboutMe.callToActionTitle')}</SectionTitle>
      <Paragraph lang={currentLang} $delay="1.8s">{t('aboutMe.callToActionText1')}</Paragraph>
      <Paragraph lang={currentLang} $delay="2s">{t('aboutMe.callToActionText2')}</Paragraph>

      <Signature lang={currentLang}>{t('aboutMe.signature')}</Signature>
    </AboutContainer>
  );
}
