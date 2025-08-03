import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaLinkedin, FaGithub } from 'react-icons/fa';
import '../styles/Footer.css';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear(); // Get the current year
  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <p>
          {t('footer.text.before')} <FaHeart className="heart-icon" /> {t('footer.text.heart')}
        </p>
        <div className="social-icons">
          <a 
            href="https://www.linkedin.com/in/fahad-alshwihani" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin className="social-icon linkedin" />
          </a>
          <a 
            href="https://github.com/FahadAlshwihani" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <FaGithub className="social-icon github" />
          </a>
        </div>
      </div>
      <div className="footer-copyright">
        <p>{t('footer.copyright', { year: currentYear })}</p>
      </div>
    </footer>
  );
}
