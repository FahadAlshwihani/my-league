// src/App.js
import React, { useContext, useState } from 'react'; // Import useState
import { Routes, Route } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import HomePage from './pages/HomePage';
import LeaguePage from './pages/LeaguePage';
import WinnersPage from './pages/WinnersPage';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';
import LanguageSelector from './components/LanguageSelector';
import Footer from './Layouts/Footer';
import Header from './Layouts/Header';
import './i18n';

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
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  return (
    <ThemeProvider>
      {!isLoading && <Header />} {/* Conditionally render Header */}
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
        <ThemeToggleButton />
        <LanguageSelector />
      </div>
      <Routes>
        {/* Pass setIsLoading to HomePage, which then passes it to GlassLeagueCard */}
        <Route path="/" element={<HomePage setIsLoading={setIsLoading} />} />
        <Route path="/league" element={<LeaguePage />} />
        <Route path="/winners" element={<WinnersPage />} />
      </Routes>
      {!isLoading && <Footer />} {/* Conditionally render Footer */}
    </ThemeProvider>
  );
}

export default App;
