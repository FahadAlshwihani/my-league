import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassLeagueCard from '../components/GlassLeagueCard';


export default function HomePage() {
    return (
        <div className="home-page">
            <GlassLeagueCard />
        </div>
    );
}
