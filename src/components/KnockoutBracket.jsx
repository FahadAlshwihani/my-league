// src/components/KnockoutBracket.jsx
import { useTranslation } from 'react-i18next'; // Import useTranslation
import styles from '../styles/KnockoutBracket.module.css';

const KnockoutBracket = ({ matches = [], updateScore }) => {
    const { t } = useTranslation(); // Initialize useTranslation

    const getRoundName = (roundIndex, totalRounds) => {
        // Use translation keys for round names
        const roundNames = [
            t('roundNames.roundOf64'),
            t('roundNames.roundOf32'),
            t('roundNames.roundOf16'),
            t('roundNames.quarterfinals'),
            t('roundNames.semifinals'),
            t('roundNames.finals')
        ];
        const idx = roundNames.length - totalRounds + roundIndex;
        return roundNames[idx] || `${t('roundNames.round')} ${roundIndex + 1}`;
    };

    return (
        <div className={styles.wrapper}>
<h2 className={styles.title}>
  <svg 
    className={styles.trophyIcon}
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <linearGradient id="trophy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFD700" />
      <stop offset="50%" stopColor="#D4AF37" />
      <stop offset="100%" stopColor="#FFEA00" />
    </linearGradient>
    <path 
      fill="url(#trophy-gradient)" 
      d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" 
    />
  </svg>
</h2>
            <div className={styles.bracket}>
                {matches.map((round, roundIndex) => (
                    <div
                        key={roundIndex}
                        className={`${styles.round} ${roundIndex === matches.length - 1 ? styles.final : ''}`}
                    >
                        <h3 className={styles.roundName}>{getRoundName(roundIndex, matches.length)}</h3>
                        <div className={styles.matches}>
                            {round.map((match, matchIndex) => (
                                <div className={styles.match} key={matchIndex}>
                                    <div className={styles.team}>{match.home}</div>
                                    <input
                                        type="number"
                                        min="0"
                                        className={styles.score}
                                        value={match.homeScore}
                                        onChange={(e) => updateScore(roundIndex, matchIndex, 'homeScore', e.target.value)}
                                    />
                                    <span className={styles.vs}>{t('vs')}</span> {/* Translate 'vs' */}
                                    <input
                                        type="number"
                                        min="0"
                                        className={styles.score}
                                        value={match.awayScore}
                                        onChange={(e) => updateScore(roundIndex, matchIndex, 'awayScore', e.target.value)}
                                    />
                                    <div className={styles.team}>{match.away}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KnockoutBracket;
