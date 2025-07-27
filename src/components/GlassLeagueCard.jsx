import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveLeagueSetup, loadLeagueSetup, clearLeagueSetup } from '../utils/storage';
import { FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/GlassLeagueCard.css';
import LoadingScreen from './LoadingScreen';

export default function GlassLeagueCard() {
    const [teamsCount, setTeamsCount] = useState('');
    const [teams, setTeams] = useState([]);
    const [roundType, setRoundType] = useState('double-round');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedData = loadLeagueSetup();
        if (savedData) {
            const { teams: savedTeams, roundType: savedRoundType } = savedData;
            setTeamsCount(savedTeams.length);
            setTeams(savedTeams);
            setRoundType(savedRoundType || 'double-round');
        }
    }, []);

    useEffect(() => {
        if (teams.length > 0 || roundType) {
            saveLeagueSetup({
                teams,
                roundType,
                lastUpdated: new Date().toISOString(),
            });
        }
    }, [teams, roundType]);

    const handleTeamsCount = (e) => {
        const count = Number(e.target.value);
        setTeamsCount(e.target.value);
        setTeams(Array(count).fill(''));
    };

    const handleTeamNameChange = (index, value) => {
        const newTeams = [...teams];
        newTeams[index] = value;
        setTeams(newTeams);
    };

    const handleSubmit = () => {
        setLoading(true);
        saveLeagueSetup({
            teams,
            roundType,
        });
        setTimeout(() => {
            setLoading(false);
            navigate('/league');
        }, 5000);
    };

    const handleClearStorage = () => {
        clearLeagueSetup();
        setTeamsCount('');
        setTeams([]);
        setRoundType('double-round');
    };

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <div className="scrollable-page">
            <div className="ultimate-glass-card">
                <h1 className="centered-title">⚽ إعدادات البطولة</h1>

                <div className="input-section">
                    <div className="input-box glow-on-hover">
                        <input
                            type="number"
                            value={teamsCount}
                            onChange={handleTeamsCount}
                            className="cyber-input"
                            placeholder=" "
                            min="0"
                        />
                        <label className="cyber-label">كم عدد الفرق؟</label>
                        <div className="cyber-highlight"></div>
                        <div className="cyber-underline">
                            <div className="cyber-underline-active"></div>
                        </div>
                        <div className="cyber-glow"></div>
                    </div>

                    {teams.map((t, i) => (
                        <div className="input-box glow-on-hover" key={i}>
                            <input
                                type="text"
                                placeholder=" "
                                value={t}
                                onChange={e => handleTeamNameChange(i, e.target.value)}
                                className="cyber-input"
                            />
                            <label className="cyber-label">{`اسم الفريق ${i + 1}`}</label>
                            <div className="cyber-highlight"></div>
                            <div className="cyber-underline">
                                <div className="cyber-underline-active"></div>
                            </div>
                            <div className="cyber-glow"></div>
                        </div>
                    ))}
                </div>

                <div className="custom-select-wrapper">
                    <div className="custom-select-container">
                        <select
                            value={roundType}
                            onChange={(e) => setRoundType(e.target.value)}
                            className="modern-select"
                        >
                            <option value="double-round">ذهاب وإياب</option>
                            <option value="single-round">ذهاب فقط</option>
                        </select>
                        <div className="select-decoration">
                            <span className="select-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M7 10l5 5 5-5z"
                                        stroke="currentColor"
                                        fill="currentColor"
                                    />
                                </svg>
                            </span>
                            <div className="select-highlight"></div>
                        </div>
                    </div>
                </div>

                <div className="button-group">
                    <button onClick={handleSubmit} className="glass-button" aria-label="Create League">
                        <span className="btn-content">
                            <FaPlus />
                        </span>
                    </button>

                    {localStorage.getItem('leagueSetup') && (
                        <button onClick={handleClearStorage} className="glass-button clear-btn" aria-label="Clear Data">
                            <span className="btn-content">
                                <FaTrash />
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
