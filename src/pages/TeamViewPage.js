import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import '../styles/TeamViewPage.css';

const TeamViewPage = () => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teamsRef = ref(database, 'auction/teams');
    const playersRef = ref(database, 'auction/players');

    const unsubscribeTeams = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      const teamArray = Object.entries(data || {}).map(([id, team]) => ({
        id,
        ...team,
      }));
      setTeams(teamArray);
    });

    const unsubscribePlayers = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      const playerArray = Object.entries(data || {}).map(([id, player]) => ({
        id,
        ...player,
      }));
      setPlayers(playerArray);
      setLoading(false);
    });

    return () => {
      unsubscribeTeams();
      unsubscribePlayers();
    };
  }, []);

  useEffect(() => {
    if (selectedTeamId) {
      const filteredPlayers = players.filter((player) => player.teamId === selectedTeamId);
      setTeamPlayers(filteredPlayers);
    }
  }, [selectedTeamId, players]);

  const calculateTeamSpend = () => {
    return teamPlayers.reduce((sum, player) => sum + (player.currentBid || 0), 0);
  };

  const getRemainingAmount = () => {
    const spent = calculateTeamSpend();
    return (100 - spent).toFixed(2); // assuming total budget is 100 Cr
  };

  if (loading) return <div className="loading">Loading team data...</div>;

  return (
    <div className="team-view-container">
      <h1 className='h1r'>IPL Team Members Viewer</h1>

      <div className="team-selector">
        <label>Select a Team:</label>
        <select value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)}>
          <option value="">-- Choose Team --</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeamId && (
        <>
          <div className="team-header">
            <h2>
              <span className="highlighted-team-name">
                {teams.find((t) => t.id === selectedTeamId)?.name}
              </span>{' '}
              Squad
            </h2>
            <div className="budget-box">
              💰 <strong>Remaining Budget:</strong>{' '}
              <span className="budget-amount">₹{getRemainingAmount()} Cr</span>
            </div>
          </div>

          <div className="player-grid">
            {teamPlayers.map((player) => (
              <div key={player.id} className="player-card">
                <img src={player.imageUrl || '/default-player.png'} alt={player.name} />
                <h3>{player.name}</h3>
                <p>Role: {player.role}</p>
                <p>Status: {player.status}</p>
                <p>Bid: ₹{player.currentBid} Cr</p>
              </div>
            ))}
            {teamPlayers.length === 0 && <p>No players assigned yet.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamViewPage;
