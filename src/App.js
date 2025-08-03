// src/App.js
import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import HomePage from './pages/HomePage';
import LeaguePage from './pages/LeaguePage';
import WinnersPage from './pages/WinnersPage';
import SupportPage from './pages/SupportPage'; // Import new SupportPage
import AboutMePage from './pages/AboutMePage'; // Import new AboutMePage
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';
import LanguageSelector from './components/LanguageSelector';
import Footer from './Layouts/Footer';
import Header from './Layouts/Header';
import './i18n';
import './index.css'; // Ensure this has the .app-wrapper style

function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        background: theme === 'light' ? '#64dcff' : '#2575fc',
        color: 'white',
        boxShadow: '0 0 10px #64dcff',
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap',
      }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Handle iOS 100vh fix
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  return (
    <ThemeProvider>
      <div className="app-wrapper">
        {!isLoading && <Header />}
        <AnimatedBackground />
        <div style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 1000,
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}>
        </div>
        <Routes>
          <Route path="/" element={<HomePage setIsLoading={setIsLoading} />} />
          <Route path="/league" element={<LeaguePage />} />
          <Route path="/winners" element={<WinnersPage />} />
          <Route path="/support" element={<SupportPage />} /> {/* New Route */}
          <Route path="/about-me" element={<AboutMePage />} /> {/* New Route */}
        </Routes>
        {!isLoading && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;
