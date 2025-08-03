// src/components/AnimatedBackground.jsx
import React from 'react';
import '../styles/AnimatedBackground.css';

export default function AnimatedBackground() {
  return (
    <div className="lines-container">
      {Array.from({ length: 30 }).map((_, i) => (
        <div 
          className="line" 
          key={i}
          style={{
            '--delay': `${i * 0.9}s`,
            '--duration': `${7 + Math.random() * 3}s`,
            '--left': `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
}
