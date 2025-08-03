// src/components/RadialMenu.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaQuestionCircle, FaLinkedin, FaGithub, FaUser } from 'react-icons/fa';
import '../styles/RadialMenu.css';
import { useTranslation } from 'react-i18next';

export default function RadialMenu() {
  const [isActive, setIsActive] = useState(false);
  const { t } = useTranslation();
  const menuRef = useRef();

  const toggleMenu = () => setIsActive(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isActive && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActive]);

  return (
    <>
      {/* Header overlay - darkens and disables the entire header */}
      <div className={`header-overlay ${isActive ? 'active' : ''}`} />

      {/* Radial Menu */}
      <div className={`radial-menu ${isActive ? 'active' : ''}`} ref={menuRef}>
        <div className="btn trigger" onClick={toggleMenu}>
          <span className="line"></span>
        </div>
        <div className="icons">
          <div className="rotater">
            <Link to="/" className="btn btn-icon" onClick={toggleMenu} aria-label={t('radialMenu.home')}>
              <FaHome />
            </Link>
          </div>
          <div className="rotater">
            <Link to="/support" className="btn btn-icon" onClick={toggleMenu} aria-label={t('radialMenu.support')}>
              <FaQuestionCircle />
            </Link>
          </div>
          <div className="rotater">
            <a href="https://www.linkedin.com/in/fahad-alshwihani" target="_blank" rel="noopener noreferrer" className="btn btn-icon" onClick={toggleMenu}>
              <FaLinkedin />
            </a>
          </div>
          <div className="rotater">
            <a href="https://github.com/FahadAlshwihani" target="_blank" rel="noopener noreferrer" className="btn btn-icon" onClick={toggleMenu}>
              <FaGithub />
            </a>
          </div>
          <div className="rotater">
            <Link to="/about-me" className="btn btn-icon" onClick={toggleMenu} aria-label={t('radialMenu.aboutMe')}>
              <FaUser />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
