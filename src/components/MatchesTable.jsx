import React from 'react';
import '../styles/MatchesTable.css';

const MatchesTable = ({ rounds, updateScore }) => {
  return (
    <div className="matches-container">
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} className="round-card">
          <h3 className="round-header">الجولة {roundIndex + 1}</h3>
          <table className="match-table">
            <thead>
              <tr>
                <th>الفريق المستضيف</th>
                <th>النتيجة</th>
                <th>الفريق الضيف</th>
              </tr>
            </thead>
            <tbody>
              {round.map((match, matchIndex) => (
                <tr key={matchIndex}>
                  <td className="team-name">{match.home}</td>
                  <td className="score-cell">
                    {match.home === 'BYE' || match.away === 'BYE' ? (
                      <span className="bye-text">راحة</span>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={match.homeScore}
                          onChange={e =>
                            updateScore(roundIndex, matchIndex, 'homeScore', e.target.value)
                          }
                          placeholder="0"
                          className="score-input"
                        />
                        -
                        <input
                          type="text"
                          value={match.awayScore}
                          onChange={e =>
                            updateScore(roundIndex, matchIndex, 'awayScore', e.target.value)
                          }
                          placeholder="0"
                          className="score-input"
                        />
                      </>
                    )}
                  </td>
                  <td className="team-name">{match.away}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MatchesTable;
