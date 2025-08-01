import React from 'react';
import '../styles/Header.css'; // Create a CSS file for styling
import { FaHeart, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t } = useTranslation();
  return (
    <header className="temporary-header">
       <p>
                {t('footer.text.before')} <FaHeart className="heart-icon" /> {t('footer.text.heart')}
              </p>
    </header>
  );
};

export default Header;
