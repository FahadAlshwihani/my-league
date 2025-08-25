// src/components/GlassLeagueCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveLeagueSetup, loadLeagueSetup, clearLeagueSetup } from '../utils/storage';
import { FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/GlassLeagueCard.css';
import LoadingScreen from './LoadingScreen';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '../utils/sweetAlert';
import { useTranslation } from 'react-i18next';

export default function GlassLeagueCard({ setIsLoading }) {
    const { t, i18n } = useTranslation();
    const [teamsCount, setTeamsCount] = useState('');
    const [teams, setTeams] = useState([]);
    const [roundType, setRoundType] = useState('double-round'); // Default to double-round
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
        const count = Math.max(0, Number(e.target.value)); // Ensure non-negative
        setTeamsCount(count.toString());
        setTeams(Array(count).fill(''));
    };

    const handleTeamNameChange = (index, value) => {
        const sanitizedValue = value.replace(/[^a-zA-Z\s\u0621-\u064A\u0660-\u0669]/g, ''); // Allow Arabic characters
        const newTeams = [...teams];
        
        // Check if name already exists (case-insensitive)
        const isDuplicate = newTeams.some((team, i) => 
            i !== index && 
            team.toLowerCase().trim() === sanitizedValue.toLowerCase().trim() &&
            sanitizedValue.trim() !== ''
        );

        if (isDuplicate) {
            showErrorAlert(t('Validation.Error'), t('Team.names.must.be.unique'));
            return;
        }

        newTeams[index] = sanitizedValue;
        setTeams(newTeams);
    };

    const validateTeams = () => {
        // Check empty names
        if (teams.some(team => team.trim() === '')) {
            showErrorAlert(t('Validation.Error'), t('All.team.names.must.be.filled'));
            return false;
        }

        // Check for duplicates (case-insensitive)
        const normalizedTeams = teams.map(team => team.toLowerCase().trim());
        const uniqueTeams = new Set(normalizedTeams);
        if (uniqueTeams.size !== teams.length) {
            showErrorAlert(t('Validation.Error'), t('Team.names.must.be.unique'));
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!teamsCount || teamsCount <= 0) {
            showErrorAlert(t('Validation.Error'), t('Please.enter.a.valid.number.of.teams'));
            return;
        }

        if (!validateTeams()) return;

        setLoading(true);
        setIsLoading(true);
        saveLeagueSetup({
            teams,
            roundType, // Save the selected round type
        });
        setTimeout(() => {
            setLoading(false);
            setIsLoading(false);
            navigate('/league');
            showSuccessAlert(t('show.Success.Alert1'), t('show.Success.Alert2'));
        }, 2000);
    };

    const handleClearStorage = () => {
        showConfirmAlert(
            t('Confirm.Clear'),
            t('Are.you.sure.you.want.to.clear.all.tournament.data?'),
            t('Yes.clear.it'),
            t('Cancel')
        ).then((willClear) => {
            if (willClear) {
                clearLeagueSetup();
                setTeamsCount('');
                setTeams([]);
                setRoundType('double-round');
                showSuccessAlert(t('Cleared!'), t('All.tournament.data.has.been.cleared'));
            }
        });
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="scrollable-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} lang={i18n.language}>
            <div className="ultimate-glass-card">
                <h1 className="centered-title">{t('Tournament.Settings')}</h1>

                <div className="input-section">
                    <div className="input-box glow-on-hover">
                        <input
                            type="number"
                            value={teamsCount}
                            onChange={handleTeamsCount}
                            className="cyber-input"
                            placeholder=" "
                            min="0"
                            required
                        />
                        <label className="cyber-label">{t('How.many.teams')}</label>
                        <div className="cyber-highlight"></div>
                        <div className="cyber-underline">
                            <div className="cyber-underline-active"></div>
                        </div>
                        <div className="cyber-glow"></div>
                    </div>

                    {teams.map((team, i) => (
                        <div className="input-box glow-on-hover" key={i}>
                            <input
                                type="text"
                                placeholder=" "
                                value={team}
                                onChange={e => handleTeamNameChange(i, e.target.value)}
                                className="cyber-input"
                                required
                                pattern="[a-zA-Z\s\u0621-\u064A\u0660-\u0669]+" // Allow Arabic characters
                                title={t('Only.alphabetic.characters.allowed')}
                            />
                            <label className="cyber-label">{`${t('Team.Name')} ${i + 1}`}</label>
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
                            required
                        >
                            <option value="double-round">{t('Home.and.Away')}</option>
                            <option value="single-round">{t('Single.Match')}</option>
                            <option value="knockout">{t('Knockout.Tournament')}</option>
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
