// src/components/AnimatedBackground.jsx
import React from 'react';
import '../styles/AnimatedBackground.css';

export default function AnimatedBackground() {
  // Generate 30 lines with random left positions and sequential delays
  return (
    <div className="lines-container">
      {Array.from({ length: 30 }).map((_, i) => (
        <div 
          className="line" 
          key={i}
          style={{
            '--delay': `${i * 0.9}s`,  // Each line starts 0.3s after previous
            '--duration': `${7 + Math.random() * 3}s`, // Varied duration
            '--left': `${Math.random() * 100}%` // Random horizontal position
          }}
        />
      ))}
    </div>
  );
}
