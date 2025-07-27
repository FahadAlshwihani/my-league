export const saveLeagueSetup = (data) => {
  localStorage.setItem('leagueSetup', JSON.stringify(data));
};

export const loadLeagueSetup = () => {
  const savedData = localStorage.getItem('leagueSetup');
  return savedData ? JSON.parse(savedData) : null;
};

export const clearLeagueSetup = () => {
  localStorage.removeItem('leagueSetup');
};

export const saveLeagueMatches = (data) => {
  localStorage.setItem('leagueMatches', JSON.stringify(data));
};

export const loadLeagueMatches = () => {
  const savedData = localStorage.getItem('leagueMatches');
  return savedData ? JSON.parse(savedData) : null;
};

export const clearLeagueMatches = () => {
  localStorage.removeItem('leagueMatches');
};
