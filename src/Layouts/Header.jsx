import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaQuestionCircle, FaLinkedin, FaGithub, FaUser , FaBars, FaTimes } from 'react-icons/fa';
import { ThemeContext } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import '../styles/Header.css';

const ModernHeader = () => {
  const { t, i18n } = useTranslation(); // Get i18n object to access current language
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Define currentLang using the i18n object
  const currentLang = i18n.language; // This will give you the current language code

  return (
    <header className="modern-header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/" className="logo">
            <span className="logo-main">Dorina</span>
            <span className="logo-sub">pro</span>
          </Link>
        </div>

        <nav className={`nav-links ${menuOpen ? 'active' : ''}`} dir={currentLang === 'ar' ? 'rtl' : 'ltr'} lang={currentLang}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            <FaHome className="nav-icon" />
            <span>{t('radialMenu.home')}</span>
          </Link>
          <Link to="/support" className="nav-link" onClick={() => setMenuOpen(false)}>
            <FaQuestionCircle className="nav-icon" />
            <span>{t('radialMenu.support')}</span>
          </Link>
          <Link to="/about-me" className="nav-link" onClick={() => setMenuOpen(false)}>
            <FaUser  className="nav-icon" />
            <span>{t('radialMenu.aboutMe')}</span>
          </Link>
          <a href="https://www.linkedin.com/in/fahad-alshwihani" 
             className="nav-link" 
             target="_blank" 
             rel="noopener noreferrer"
             onClick={() => setMenuOpen(false)}>
            <FaLinkedin className="nav-icon" />
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/FahadAlshwihani" 
             className="nav-link" 
             target="_blank" 
             rel="noopener noreferrer"
             onClick={() => setMenuOpen(false)}>
            <FaGithub className="nav-icon" />
            <span>GitHub</span>
          </a>
        </nav>

        <div className="header-controls">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            <span className="toggle-icon">
              {theme === 'light' ? '☀️' : '🌙'}
            </span>
            <span className="toggle-text">
              {theme === 'light' ? 'Light' : 'Dark'}
            </span>
          </button>
          <LanguageSelector />

          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Menu">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
