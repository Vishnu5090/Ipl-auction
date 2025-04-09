import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import '../styles/UserPage.css';

const UserPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [soldCount, setSoldCount] = useState(0);
  const [unsoldCount, setUnsoldCount] = useState(0);

  useEffect(() => {
    const playersRef = ref(database, 'auction/players');
    const teamsRef = ref(database, 'auction/teams');
    const currentPlayerRef = ref(database, 'auction/currentPlayer');

    const unsubscribePlayers = onValue(playersRef, (snapshot) => {
      const playersData = snapshot.val();
      const playersArray = Object.entries(playersData || {}).map(([id, player]) => ({
        id,
        ...player,
      }));

      playersArray.sort((a, b) => a.order - b.order);

      let sold = 0, unsold = 0;
      playersArray.forEach((p) => {
        if (p.status === 'sold') sold++;
        else if (p.status === 'unsold') unsold++;
      });

      setPlayers(playersArray);
      setSoldCount(sold);
      setUnsoldCount(unsold);
      setLoading(false);
    });

    const unsubscribeTeams = onValue(teamsRef, (snapshot) => {
      const teamsData = snapshot.val();
      if (teamsData) {
        const teamsArray = Object.entries(teamsData).map(([id, team]) => ({
          id,
          ...team,
        }));
        setTeams(teamsArray);
      }
    });

    const unsubscribeCurrentPlayer = onValue(currentPlayerRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.id) {
        setCurrentPlayerId(data.id);
      }
    });

    return () => {
      unsubscribePlayers();
      unsubscribeTeams();
      unsubscribeCurrentPlayer();
    };
  }, []);

  if (loading) return <div className="loading">Loading players...</div>;

  const currentPlayer = players.find(p => p.id === currentPlayerId);

  return (
    <div className="user-container">
      <div className="stats-overview">
        <div className="stat-card"><h3>Total Players</h3><p>{players.length}</p></div>
        <div className="stat-card"><h3>Sold Players</h3><p>{soldCount}</p></div>
        <div className="stat-card"><h3>Unsold Players</h3><p>{unsoldCount}</p></div>
        <div className="stat-card"><h3>Teams</h3><p>{teams.length}</p></div>
      </div>

      {currentPlayer ? (
        <div className="player-wrapper">
          <div className={`styled-card ${currentPlayer.status}`}>
            <div className="player-image">
              <img src={currentPlayer.imageUrl || "https://via.placeholder.com/180"} alt={currentPlayer.name} />
            </div>

            <div className="player-info">
              <h2>{currentPlayer.name}</h2>
              <div className="player-role">Role: <span>{currentPlayer.role || "N/A"}</span></div>
              <div className="player-baseprice">Base Price: <span>₹{currentPlayer.basePrice} Cr</span></div>
              <div className="player-runs">Runs: <span>{currentPlayer.stats?.runs || "N/A"}</span></div>
              <div className="team-info">
                Team: <span>{teams.find(t => t.id === currentPlayer.teamId)?.name || "N/A"}</span>
              </div>
              <div className="player-matches">Matches: <span>{currentPlayer.stats?.matches || "N/A"}</span></div>
              <div className="player-status">
                Status: <span className={`status-text ${currentPlayer.status}`}>{currentPlayer.status}</span>
              </div>
              <div className="highlight-panel bid-panel">
                <div className="highlight-label">CURRENT BID</div>
                <div className="highlight-value">₹ {currentPlayer.currentBid || 0} Cr</div>
              </div>
              <div className="highlight-panel points-panel">
                <div className="highlight-label">POINTS</div>
                <div className="highlight-value">{currentPlayer.points || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No player selected for auction yet.</p>
      )}
    </div>
  );
};

export default UserPage;
