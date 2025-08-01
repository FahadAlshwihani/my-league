import React from 'react';
import '../styles/MatchesTable.css';
import { useTranslation } from 'react-i18next';

const MatchesTable = ({ rounds, updateScore }) => {
  const { t } = useTranslation();

  return (
    <div className="matches-container">
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} className={`round-section ${roundIndex > 0 ? 'round-border' : ''}`}>
          <h3 className="round-header">
            {t('round.header')} {roundIndex + 1}
          </h3>
          <table className="match-table">
            <thead>
              <tr>
                <th>{t('match.table1')}</th>
                <th>{t('match.table2')}</th>
                <th>{t('match.table3')}</th>
              </tr>
            </thead>
            <tbody>
              {round.map((match, matchIndex) => (
                <tr key={matchIndex}>
                  <td className="team-name">{match.home}</td>
                  <td className="score-cell">
                    {match.home === 'BYE' || match.away === 'BYE' ? (
                      <span className="bye-text">{t('bye.team')}</span>
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
                        <span className="score-separator">-</span>
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
