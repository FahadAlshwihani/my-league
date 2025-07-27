import React, { useEffect, useState, useCallback, useMemo } from 'react';
import MatchesTable from '../components/MatchesTable';
import TeamsTable from '../components/TeamsTable';
import { FaPrint, FaUndo, FaTable, FaFutbol, FaPen } from 'react-icons/fa'; // Importing icons
import { Tooltip } from 'react-tooltip';
import '../styles/LeaguePage.css';

import {
  saveLeagueSetup,
  loadLeagueSetup,
  clearLeagueSetup,
  saveLeagueMatches,
  loadLeagueMatches,
  clearLeagueMatches,
} from '../utils/storage';

export default function LeaguePage() {
  const setup = useMemo(() => loadLeagueSetup(), []);
  const savedRounds = useMemo(() => loadLeagueMatches(), []);

  const [teams, setTeams] = useState(setup ? setup.teams : []);
  const [rounds, setRounds] = useState(savedRounds || []);
  const [activeTab, setActiveTab] = useState('editTeams'); // Default to 'editTeams'

  const generateRounds = useCallback((teams, isDoubleRound) => {
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

  useEffect(() => {
    if (setup && rounds.length === 0) {
      const generatedRounds = generateRounds(setup.teams, setup.roundType === 'double-round');
      setRounds(generatedRounds);
    }
  }, [setup, generateRounds, rounds.length]);

  useEffect(() => {
    if (rounds.length > 0) {
      saveLeagueMatches(rounds);
    }
  }, [rounds]);

  const updateScore = useCallback((roundIndex, matchIndex, field, value) => {
    setRounds(prevRounds => {
      const newRounds = [...prevRounds];
      newRounds[roundIndex] = [...newRounds[roundIndex]];
      newRounds[roundIndex][matchIndex] = {
        ...newRounds[roundIndex][matchIndex],
        [field]: value === '' ? '' : parseInt(value) || 0,
      };
      return newRounds;
    });
  }, []);

  const updateTeamName = useCallback((index, newName) => {
    const oldName = teams[index];
    const updatedTeams = [...teams];
    updatedTeams[index] = newName;
    setTeams(updatedTeams);

    const updatedSetup = {
      ...setup,
      teams: updatedTeams,
    };
    saveLeagueSetup(updatedSetup);

    setRounds(prev =>
      prev.map(round =>
        round.map(m => ({
          ...m,
          home: m.home === oldName ? newName : m.home,
          away: m.away === oldName ? newName : m.away,
        }))
      )
    );
  }, [teams, setup]);

  const resetLeague = useCallback(() => {
    clearLeagueSetup();
    clearLeagueMatches();
    window.location.href = '/';
  }, []);

  const handleTabChange = (event) => {
    setActiveTab(event.target.id);
  };

  return (
    <div className="league-page">
      <h1>🏆 إدارة الدوري</h1>

      <div className="control">
        <div className="control__track">
          <div className="indicator"></div>
          <label htmlFor="editTeams">
            <FaPen size={20} />
          </label>
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
              <span className="sr-only">Premium Solo</span>
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
              <span className="sr-only">Premium Team</span>
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

      <div className={`tab-content ${activeTab === 'editTeams' ? 'fade-in' : 'fade-out'}`}>
        {activeTab === 'editTeams' && (
          <>
            <h2 className="creative-heading">✏️ تعديل أسماء الفرق</h2>
<div className="creative-edit-card">
  <div className="teams-editor">
    {teams.map((t, i) => (
      <div key={i} className="team-input-container">
        <input
          type="text"
          value={t}
          onChange={e => updateTeamName(i, e.target.value)}
          className="team-name-input"
          placeholder={`اسم الفريق ${i + 1}`}
        />
      </div>
    ))}
  </div>
<div className="action-buttons">
  <button className="glass-button" onClick={() => window.print()} aria-label="Print Results">
    <FaPrint />
  </button>
  <button className="glass-button" onClick={resetLeague} aria-label="Reset League">
    <FaUndo />
  </button>
</div>

</div>

          </>
        )}

        {activeTab === 'standings' && (
          <div className={`standings-tab ${activeTab === 'standings' ? 'fade-in' : 'fade-out'}`}>
            <TeamsTable teams={teams} rounds={rounds} />
          </div>
        )}

        {activeTab === 'matches' && (
          <div className={`matches-tab ${activeTab === 'matches' ? 'fade-in' : 'fade-out'}`}>
            <MatchesTable rounds={rounds} updateScore={updateScore} />
          </div>
        )}
      </div>
    </div>
  );
}


// ---------------------------
// 🔥 خوارزمية توزيع الجولات
function generateRounds(teams, isDoubleRound) {
  let t = [...teams];
  if (t.length % 2 !== 0) {
    t.push('BYE'); // لو عدد الفرق فردي نضيف فريق راحة
  }

  const n = t.length;
  const half = n / 2;
  const roundsCount = n - 1;
  const teamList = t.slice(1);
  const fixed = t[0];

  const rounds = [];

  for (let round = 0; round < roundsCount; round++) {
    const roundMatches = [];

    // الفريق الثابت ضد أحد الفرق
    const opponent = teamList[(round) % (n - 1)];
    if (fixed !== 'BYE' && opponent !== 'BYE') {
      roundMatches.push({ home: fixed, away: opponent });
    }

    // باقي المباريات
    for (let i = 1; i < half; i++) {
      const homeIndex = (round + i) % (n - 1);
      const awayIndex = (round - i + (n - 1)) % (n - 1);
      const home = teamList[homeIndex];
      const away = teamList[awayIndex];

      if (home !== 'BYE' && away !== 'BYE') {
        roundMatches.push({ home, away });
      }
    }

    rounds.push(roundMatches);
  }

  if (isDoubleRound) {
    const returnRounds = rounds.map(matches =>
      matches.map(m => ({ home: m.away, away: m.home }))
    );
    return [...rounds, ...returnRounds];
  }

  return rounds;
}
