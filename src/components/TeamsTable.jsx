import React, { useState, useEffect } from 'react';
import '../styles/TeamsTable.css';

const medalIcons = ['🥇', '🥈', '🥉'];

export default function TeamsTable({ teams, rounds }) {
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
      team, played: 0, win: 0, draw: 0, lose: 0, gf: 0, ga: 0, pts: 0
    }));

    const allMatches = rounds.flat();

    allMatches.forEach(m => {
      if (m.homeScore !== '' && m.awayScore !== '') {
        const home = table.find(t => t.team === m.home);
        const away = table.find(t => t.team === m.away);
        home.played++; away.played++;
        home.gf += +m.homeScore; home.ga += +m.awayScore;
        away.gf += +m.awayScore; away.ga += +m.homeScore;

        if (+m.homeScore > +m.awayScore) {
          home.win++; home.pts += 3; away.lose++;
        } else if (+m.homeScore < +m.awayScore) {
          away.win++; away.pts += 3; home.lose++;
        } else {
          home.draw++; away.draw++; home.pts++; away.pts++;
        }
      }
    });

    return table.sort((a, b) =>
      b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga)
    );
  };

  const standings = calculateTable();

  if (isMobile) {
    return (
      <div className="teams-grid">
        <h2 className="grid-title">📊 جدول النقاط</h2>
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
              <div className="stat-item">GF: {s.gf}</div>
              <div className="stat-item">GA: {s.ga}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="print-area">
      <h2>📊 جدول النقاط</h2>
      <table className="teams-table">
        <thead>
          <tr>
            <th>الفريق</th><th>لعب</th><th>ف</th><th>ت</th><th>خ</th><th>له</th><th>عليه</th><th>نقاط</th>
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
              <td>{s.gf}</td>
              <td>{s.ga}</td>
              <td>{s.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
