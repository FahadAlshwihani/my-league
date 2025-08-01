// src/pages/HomePage.jsx
import React from 'react';
import GlassLeagueCard from '../components/GlassLeagueCard';

export default function HomePage({ setIsLoading }) { // Accept setIsLoading prop
    return (
        <div className="home-page">
            <GlassLeagueCard setIsLoading={setIsLoading} /> {/* Pass setIsLoading */}
        </div>
    );
}
