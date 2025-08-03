import React, { useState, useEffect } from 'react';
import '../styles/TeamsTable.css';
import { useTranslation } from 'react-i18next';

const medalIcons = ['🥇', '🥈', '🥉'];

// Normalize team names helper
const normalize = name => name?.toString().trim().toLowerCase().replace(/\s+/g, '').replace(/[^a-zA-Z\u0621-\u064A\u0660-\u0669]/g, '');

export default function TeamsTable({ teams, rounds }) {
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const calculateTable = () => {
    const table = teams.map(team => ({
      team,
      normalized: normalize(team),
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      gf: 0,
      ga: 0,
      pts: 0,
    }));

    const allMatches = rounds.flat();

    allMatches.forEach(m => {
      if (m.homeScore !== '' && m.awayScore !== '') {
        const homeName = normalize(m.home);
        const awayName = normalize(m.away);

        const home = table.find(t => t.normalized === homeName);
        const away = table.find(t => t.normalized === awayName);

        if (!home || !away) {
          console.error(`❌ Team not found: Home - ${m.home}, Away - ${m.away}`);
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

    return table.sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
  };

  const standings = calculateTable();

  if (isMobile) {
    return (
      <div className="teams-container" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <h2 className="creative-heading-team">{t('creative.heading.team')}</h2>
        <div className="teams-grid">
          {standings.map((s, index) => (
            <div key={s.team} className="team-card">
              <div className="team-rank">{medalIcons[index] || index + 1}</div>
              <div className="team-name">{s.team}</div>
              <div className="team-stats">
                <div className="stat-item">PTS: {s.pts}</div>
                <div className="stat-item">PLAYED: {s.played}</div>
                <div className="stat-item">WIN: {s.win}</div>
                <div className="stat-item">DRAW: {s.draw}</div>
                <div className="stat-item">LOSES: {s.lose}</div>
                <div className="stat-item">GD: {s.gf - s.ga}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="print-area" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <h2 className="creative-heading-team">{t('creative.heading.team')}</h2>
      <table className="teams-table">
        <thead>
          <tr>
            <th>{t('teams.table.stat1')}</th>
            <th>{t('teams.table.stat2')}</th>
            <th>{t('teams.table.stat7')}</th>
            <th>{t('teams.table.stat3')}</th>
            <th>{t('teams.table.stat4')}</th>
            <th>{t('teams.table.stat5')}</th>
            <th>{t('teams.table.stat6')}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, index) => (
            <tr key={s.team}>
              <td>
                {medalIcons[index] && <span className="medal-icon">{medalIcons[index]}</span>} {s.team}
              </td>
              <td>{s.played}</td>
              <td>{s.win}</td>
              <td>{s.draw}</td>
              <td>{s.lose}</td>
              <td>{s.gf - s.ga}</td>
              <td>{s.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
