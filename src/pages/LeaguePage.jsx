import React, { useEffect, useState, useCallback, useMemo } from 'react';
import MatchesTable from '../components/MatchesTable';
import TeamsTable from '../components/TeamsTable';
import KnockoutBracket from '../components/KnockoutBracket'; // Import KnockoutBracket
import { FaPrint, FaUndo, FaTable, FaFutbol, FaPen, FaTrophy } from 'react-icons/fa';
import '../styles/LeaguePage.css';
import { useNavigate } from 'react-router-dom';
import { showConfirmAlert, showErrorAlert } from '../utils/sweetAlert';
import { useTranslation } from 'react-i18next';
import { FiSettings } from 'react-icons/fi';


import {
  saveLeagueSetup,
  loadLeagueSetup,
  clearLeagueSetup,
  saveLeagueMatches,
  loadLeagueMatches,
  clearLeagueMatches,
} from '../utils/storage';

export default function LeaguePage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const setup = useMemo(() => loadLeagueSetup(), []);
  const savedRounds = useMemo(() => loadLeagueMatches(), []);
  const navigate = useNavigate();

  const [teams, setTeams] = useState(setup ? setup.teams : []);
  const [rounds, setRounds] = useState(savedRounds || []);
  const [knockoutMatches, setKnockoutMatches] = useState(savedRounds || []); // State for knockout matches
  const [activeTab, setActiveTab] = useState('editTeams');

  // Function to generate round-robin matches
  const generateRoundRobin = useCallback((teams, isDoubleRound) => {
    if (!teams || teams.length === 0) return [];

    let t = [...teams];
    if (t.length % 2 !== 0) t.push('BYE');

    const n = t.length;
    const half = n / 2;
    const roundsCount = n - 1;
    const teamList = t.slice(1);
    const fixed = t[0];

    const rounds = [];

    for (let round = 0; round < roundsCount; round++) {
      const roundMatches = [];

      const opponent = teamList[round % (n - 1)];
      if (fixed !== 'BYE' && opponent !== 'BYE') {
        roundMatches.push({ home: fixed, away: opponent, homeScore: '', awayScore: '' });
      }

      for (let i = 1; i < half; i++) {
        const homeIndex = (round + i) % (n - 1);
        const awayIndex = (round - i + (n - 1)) % (n - 1);
        const home = teamList[homeIndex];
        const away = teamList[awayIndex];

        if (home !== 'BYE' && away !== 'BYE') {
          roundMatches.push({ home, away, homeScore: '', awayScore: '' });
        }
      }

      rounds.push(roundMatches);
    }

    if (isDoubleRound) {
      const returnRounds = rounds.map(matches =>
        matches.map(m => ({
          home: m.away,
          away: m.home,
          homeScore: '',
          awayScore: '',
        }))
      );
      return [...rounds, ...returnRounds];
    }

    return rounds;
  }, []);

  // Function to generate knockout matches
// Function to generate knockout matches
const generateKnockoutMatches = useCallback((teams) => {
    if (!teams || teams.length === 0) return [];

    let participants = [...teams];
    if (participants.length % 2 !== 0) {
        participants.push('BYE'); // Add a BYE if the number is odd
    }

    const bracket = [];
    const roundsCount = Math.log2(participants.length); // Calculate the number of rounds

    // Generate matches for each round
    for (let round = 0; round < roundsCount; round++) {
        const currentRound = [];
        const matchesInRound = participants.length / Math.pow(2, round + 1); // Number of matches in this round

        for (let i = 0; i < matchesInRound; i++) {
            const home = participants[i * 2];
            const away = participants[i * 2 + 1];
            currentRound.push({
                home,
                away,
                homeScore: '',
                awayScore: '',
            });
        }
        bracket.push(currentRound);
        
        // Prepare for the next round
        participants = currentRound.map((match, index) => `Winner of Match ${index + 1}`);
    }

    return bracket;
}, []);





  useEffect(() => {
    if (setup) {
      if (setup.roundType === 'knockout') {
        if (knockoutMatches.length === 0 || !savedRounds) { // Only generate if no saved matches
          const generatedKnockout = generateKnockoutMatches(setup.teams);
          setKnockoutMatches(generatedKnockout);
          saveLeagueMatches(generatedKnockout);
        }
      } else {
        if (rounds.length === 0 || !savedRounds) { // Only generate if no saved matches
          const generatedRounds = generateRoundRobin(setup.teams, setup.roundType === 'double-round');
          setRounds(generatedRounds);
          saveLeagueMatches(generatedRounds);
        }
      }
    }
  }, [setup, generateRoundRobin, generateKnockoutMatches, rounds.length, knockoutMatches.length, savedRounds]);


  useEffect(() => {
    if (setup?.roundType === 'knockout') {
      if (knockoutMatches.length > 0) {
        saveLeagueMatches(knockoutMatches);
      }
    } else {
      if (rounds.length > 0) {
        saveLeagueMatches(rounds);
      }
    }
  }, [rounds, knockoutMatches, setup]);

  const updateScore = useCallback((roundIndex, matchIndex, field, value) => {
    if (setup.roundType === 'knockout') {
      setKnockoutMatches(prevMatches => {
        const newMatches = [...prevMatches];
        newMatches[roundIndex] = [...newMatches[roundIndex]];
        newMatches[roundIndex][matchIndex] = {
          ...newMatches[roundIndex][matchIndex],
          [field]: value === '' ? '' : parseInt(value) || 0,
        };

        // Determine winner and update next round
        const currentMatch = newMatches[roundIndex][matchIndex];
        if (currentMatch.homeScore !== '' && currentMatch.awayScore !== '') {
          let winner = null;
          if (currentMatch.homeScore > currentMatch.awayScore) {
            winner = currentMatch.home;
          } else if (currentMatch.awayScore > currentMatch.homeScore) {
            winner = currentMatch.away;
          } else {
            // Handle draw in knockout (e.g., sudden death, replay, or specific rule)
            // For simplicity, let's say higher seed wins or first team listed wins on draw
            // Or, you can prevent draw by showing an error or forcing a winner
            showErrorAlert(t('Knockout.Draw.Error'), t('Knockout.Draw.Message'));
            return prevMatches; // Prevent update if draw is not allowed
          }

          if (winner && roundIndex + 1 < newMatches.length) {
            const nextRoundMatchIndex = Math.floor(matchIndex / 2);
            const isHomeTeamInNextRound = matchIndex % 2 === 0;

            newMatches[roundIndex + 1] = [...newMatches[roundIndex + 1]];
            newMatches[roundIndex + 1][nextRoundMatchIndex] = {
              ...newMatches[roundIndex + 1][nextRoundMatchIndex],
              [isHomeTeamInNextRound ? 'home' : 'away']: winner,
            };
          }
        }
        return newMatches;
      });
    } else {
      setRounds(prevRounds => {
        const newRounds = [...prevRounds];
        newRounds[roundIndex] = [...newRounds[roundIndex]];
        newRounds[roundIndex][matchIndex] = {
          ...newRounds[roundIndex][matchIndex],
          [field]: value === '' ? '' : parseInt(value) || 0,
        };
        return newRounds;
      });
    }
  }, [setup, t]);

  const updateTeamName = useCallback((index, newName) => {
    const sanitizedValue = newName.replace(/[^a-zA-Z\s\u0621-\u064A\u0660-\u0669]/g, '');

    if (!sanitizedValue.trim()) {
      showErrorAlert(t('Validation.Error'), t('Team.name.cannot.be.empty'));
      return;
    }

    if (/[^a-zA-Z\s\u0621-\u064A\u0660-\u0669]/.test(sanitizedValue.trim())) {
      showErrorAlert(t('Validation.Error'), t('Only.alphabetic.characters.allowed'));
      return;
    }

    const oldName = teams[index];
    const updatedTeams = [...teams];
    updatedTeams[index] = sanitizedValue.trim();
    setTeams(updatedTeams);

    const updatedSetup = {
      ...setup,
      teams: updatedTeams,
    };
    saveLeagueSetup(updatedSetup);

    // Update team names in both round-robin and knockout matches
    if (setup.roundType === 'knockout') {
      setKnockoutMatches(prev =>
        prev.map(round =>
          round.map(m => ({
            ...m,
            home: m.home === oldName ? sanitizedValue.trim() : m.home,
            away: m.away === oldName ? sanitizedValue.trim() : m.away,
          }))
        )
      );
    } else {
      setRounds(prev =>
        prev.map(round =>
          round.map(m => ({
            ...m,
            home: m.home === oldName ? sanitizedValue.trim() : m.home,
            away: m.away === oldName ? sanitizedValue.trim() : m.away,
          }))
        )
      );
    }
  }, [teams, setup, t]);

  const resetLeague = useCallback(() => {
    showConfirmAlert(
      t('reset.League1'),
      t('reset.League2'),
      t('reset.League.confirm.button'),
      t('reset.League.cancel.button')
    ).then((willReset) => {
      if (willReset) {
        clearLeagueSetup();
        clearLeagueMatches();
        window.location.href = '/';
      }
    });
  }, [t]);

  const handleTabChange = (event) => {
    setActiveTab(event.target.id);
  };

  const extractTeamsFromMatches = (matches) => {
    const teamSet = new Set();
    matches.flat().forEach(match => {
      if (match.home && match.home !== 'BYE' && !match.home.startsWith('Winner of')) teamSet.add(match.home.trim());
      if (match.away && match.away !== 'BYE' && !match.away.startsWith('Winner of')) teamSet.add(match.away.trim());
    });
    return Array.from(teamSet);
  };

  const teamsForStandings = useMemo(() => {
    if (setup?.roundType === 'knockout') {
      return extractTeamsFromMatches(knockoutMatches);
    } else {
      return extractTeamsFromMatches(rounds);
    }
  }, [rounds, knockoutMatches, setup]);


  const calculateStandingsForEndLeague = useCallback(() => {
    const matchesToCalculate = setup?.roundType === 'knockout' ? knockoutMatches : rounds;
    const teamsToCalculate = teamsForStandings;

    const table = teamsToCalculate.map(team => ({
      team,
      normalized: team.toString().trim().toLowerCase().replace(/\s+/g, ''),
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      gf: 0,
      ga: 0,
      pts: 0
    }));

    const allMatches = matchesToCalculate.flat();

    allMatches.forEach(m => {
      if (m.homeScore !== '' && m.awayScore !== '' && m.home !== 'BYE' && m.away !== 'BYE') {
        const homeName = m.home.toString().trim().toLowerCase().replace(/\s+/g, '');
        const awayName = m.away.toString().trim().toLowerCase().replace(/\s+/g, '');

        const home = table.find(t => t.normalized === homeName);
        const away = table.find(t => t.normalized === awayName);

        if (!home || !away) {
          console.error(`❌ Team not found for standings calculation: Home - ${m.home}, Away - ${m.away}`);
          return;
        }

        home.played++;
        away.played++;
        home.gf += +m.homeScore;
        home.ga += +m.awayScore;
        away.gf += +m.awayScore;
        away.ga += +m.homeScore;

        if (+m.homeScore > +m.awayScore) {
          home.win++;
          home.pts += 3;
          away.lose++;
        } else if (+m.homeScore < +m.awayScore) {
          away.win++;
          away.pts += 3;
          home.lose++;
        } else {
          home.draw++;
          away.draw++;
          home.pts++;
          away.pts++;
        }
      }
    });

    // For knockout, the winner is the last team standing
    if (setup?.roundType === 'knockout' && knockoutMatches.length > 0) {
      const finalMatch = knockoutMatches[knockoutMatches.length - 1][0];
      let winnerTeam = null;
      if (finalMatch && finalMatch.homeScore !== '' && finalMatch.awayScore !== '') {
        if (finalMatch.homeScore > finalMatch.awayScore) {
          winnerTeam = finalMatch.home;
        } else if (finalMatch.awayScore > finalMatch.homeScore) {
          winnerTeam = finalMatch.away;
        }
      }

      if (winnerTeam) {
        // Simple standings for knockout: winner first, then others by points/GD from played matches
        const winnerEntry = table.find(t => t.team === winnerTeam);
        const otherEntries = table.filter(t => t.team !== winnerTeam);
        return [winnerEntry, ...otherEntries.sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))];
      }
    }

    return table.sort((a, b) =>
      b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga)
    );
  }, [teamsForStandings, rounds, knockoutMatches, setup]);

  const handleEndLeague = () => {
    showConfirmAlert(
      t('End.League1'),
      t('End.League2'),
      t('End.League.confirm.button'),
      t('End.League.cancel.button'),
    ).then((willEnd) => {
      if (willEnd) {
        const finalStandings = calculateStandingsForEndLeague();
        clearLeagueSetup();
        clearLeagueMatches();
        navigate('/winners', { state: { standings: finalStandings } });
      }
    });
  };

  return (
    <div className="league-page">
      <div className="settings-title-wrapper">
        <FiSettings className="settings-icon" />
        <span className="settings-tooltip">{t('league.title')}</span>
      </div>

      <div className="control">
        <div className="control__track">
          <div className="indicator"></div>
          <label htmlFor="editTeams"><FaPen size={20} /></label>
          <input
            className="sr-only"
            type="radio"
            name="tier"
            id="editTeams"
            checked={activeTab === 'editTeams'}
            onChange={handleTabChange}
          />
          <div className="premium">
            <div className="indicator"></div>
            <label htmlFor="standings">
              <span style={{ display: activeTab === 'standings' || activeTab === 'matches' ? 'inline' : 'none' }}>
                <FaTable size={20} />
              </span>
            </label>
            <input
              className="sr-only"
              type="radio"
              name="tier"
              id="standings"
              checked={activeTab === 'standings'}
              onChange={handleTabChange}
            />
            <label htmlFor="matches">
              <span style={{ display: activeTab === 'standings' || activeTab === 'matches' ? 'inline' : 'none' }}>
                <FaFutbol size={20} />
              </span>
            </label>
            <input
              className="sr-only"
              type="radio"
              name="tier"
              id="matches"
              checked={activeTab === 'matches'}
              onChange={handleTabChange}
            />
          </div>
        </div>
      </div>

      <div className={`tab-content ${activeTab === 'editTeams' ? 'fade-in' : 'fade-out'}`} dir={currentLang === 'ar' ? 'rtl' : 'ltr'} lang={currentLang}>
        {activeTab === 'editTeams' && (
          <>
            <h2 className="creative-heading">{t('creative.heading')}</h2>
            <div className="creative-edit-card">
              <div className="teams-editor">
                {teams.map((team, i) => (
                  <div key={i} className="team-input-container">
                    <input
                      type="text"
                      value={team}
                      onChange={e => updateTeamName(i, e.target.value)}
                      className="team-name-input"
                      placeholder={`${t('team.name.input')} ${i + 1}`}
                    />
                  </div>
                ))}

                <div className="action-buttons">
                  <button className="glass-button" onClick={() => window.print()} aria-label="Print Results"><FaPrint /></button>
                  <button className="glass-button" onClick={resetLeague} aria-label="Reset League"><FaUndo /></button>
                  <button className="glass-button end-league-btn" onClick={handleEndLeague} aria-label="End League">
                    <FaTrophy />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'standings' && (
          <div className={`standings-tab fade-in`} dir={currentLang === 'ar' ? 'rtl' : 'ltr'} lang={currentLang}>
            <TeamsTable teams={teamsForStandings} rounds={setup?.roundType === 'knockout' ? knockoutMatches : rounds} />
          </div>
        )}

        {activeTab === 'matches' && (
          <div className={`matches-tab fade-in`} style={{ display: 'flex', justifyContent: 'center' }} dir={currentLang === 'ar' ? 'rtl' : 'ltr'} lang={currentLang}>
            {setup?.roundType === 'knockout' ? (
              <KnockoutBracket matches={knockoutMatches} updateScore={updateScore} />
            ) : (
              <MatchesTable rounds={rounds} updateScore={updateScore} />
            )}
          </div>
        )}

      </div>
    </div>
  );
}
