import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import '../styles/UserPage.css';

const UserPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [soldCount, setSoldCount] = useState(0);
  const [unsoldCount, setUnsoldCount] = useState(0);

  useEffect(() => {
    const playersRef = ref(database, 'auction/players');
    const teamsRef = ref(database, 'auction/teams');

    const unsubscribePlayers = onValue(playersRef, (snapshot) => {
      const playersData = snapshot.val();
      let playersArray = Object.entries(playersData || {}).map(([id, player]) => ({
        id,
        ...player
      }));

      // Sort: Sold first
      playersArray.sort((a, b) => {
        if (a.status === 'sold' && b.status !== 'sold') return -1;
        if (a.status !== 'sold' && b.status === 'sold') return 1;
        return 0;
      });

      let sold = 0, unsold = 0;
      playersArray.forEach((p) => {
        if (p.status === 'sold') sold++;
        else if (p.status === 'unsold') unsold++;
      });

      setSoldCount(sold);
      setUnsoldCount(unsold);
      setPlayers(playersArray);
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

    return () => {
      unsubscribePlayers();
      unsubscribeTeams();
    };
  }, []);

  const nextPlayer = () => {
    const currentPlayer = players[currentIndex];
    if (currentPlayer?.status !== 'unsold') {
      const nextIndex = (currentIndex + 1) % players.length;
      setCurrentIndex(nextIndex);
    } else {
      alert('You cannot move to the next player until the current player is sold!');
    }
  };

  if (loading) return <div className="loading">Loading players...</div>;

  const currentPlayer = players[currentIndex];

  return (
    <div className="user-container">
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Players</h3>
          <p>{players.length}</p>
        </div>
        <div className="stat-card">
          <h3>Sold Players</h3>
          <p>{soldCount}</p>
        </div>
        <div className="stat-card">
          <h3>Unsold Players</h3>
          <p>{unsoldCount}</p>
        </div>
        <div className="stat-card">
          <h3>Teams</h3>
          <p>{teams.length}</p>
        </div>
      </div>

      {currentPlayer ? (
        <div className="player-wrapper">
          <div className={`styled-card ${currentPlayer?.status}`}>
            <div className="player-image">
              <img
                src={currentPlayer?.imageUrl || "https://via.placeholder.com/180"}
                alt={currentPlayer?.name}
              />
              
            </div>

            <div className="player-info">
  <h2>{currentPlayer?.name}</h2>
  <div className="player-bid highlight-bid-container">
  <span className="highlight-bid-label">Current Bid:</span>{" "}
  <span className="highlight-bid">₹{currentPlayer?.currentBid || 0} Cr</span>
</div>

<div className="player-points highlight-points-container">
  <span className="highlight-points-label">Points:</span>{" "}
  <span className="highlight-points">
    {currentPlayer?.points || "N/A"}
  </span>
</div>

  <div className="player-role">
    Role: <span>{currentPlayer?.role || "N/A"}</span>
  </div>

  

    <div className="player-baseprice">
      Base Price: <span>₹{currentPlayer?.basePrice} Cr</span>
    </div>

    <div className="player-runs">
    Runs: <span>{currentPlayer?.stats?.runs || "N/A"}</span>
  </div>
  

  <div className="team-info">
    Team:{" "}
    <span>
      {teams.find((t) => t.id === currentPlayer?.teamId)?.name || "N/A"}
    </span>
  </div>

  <div className="player-matches">
    Matches: <span>{currentPlayer?.stats?.matches || "N/A"}</span>
  </div>

  <div className="player-status">
    Status:{" "}
    <span className={`status-text ${currentPlayer?.status}`}>
      {currentPlayer?.status}
    </span>
  </div>


            </div>
          </div>
        </div>
      ) : (
        <p>No player data available.</p>
      )}

      <div className="next-button-container">
        <button onClick={nextPlayer} className="next-button">
          Next Player
        </button>
      </div>
    </div>
  );
};

export default UserPage;
