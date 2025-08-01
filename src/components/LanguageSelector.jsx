// src/components/LanguageSwitcher.jsx
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { US, SA } from 'country-flag-icons/react/3x2';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/LanguageSelector.css'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button 
        className="language-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {i18n.language === 'en' ? <US className="flag-icon" /> : <SA className="flag-icon" />}
        <FaChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <div className="language-dropdown">
          <button onClick={() => handleLanguageChange('en')}>
            <US className="flag-icon" />
            <span>English</span>
          </button>
          <button onClick={() => handleLanguageChange('ar')}>
            <SA className="flag-icon" />
            <span>العربية</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
