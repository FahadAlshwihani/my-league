import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import HomePage from './pages/HomePage'; // Import the updated HomePage
import LeaguePage from './pages/LeaguePage';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';

function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        background: theme === 'light' ? '#64dcff' : '#2575fc',
        color: 'white',
        boxShadow: '0 0 10px #64dcff',
        transition: 'all 0.3s ease',
        zIndex: 1000,
      }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AnimatedBackground />
      <ThemeToggleButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/league" element={<LeaguePage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
