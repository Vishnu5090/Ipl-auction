import React, { useState, useEffect } from 'react';
import { ref, onValue, update, push, set } from 'firebase/database';
import { database } from '../firebase';
import '../styles/AdminPage.css';


const AdminPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const playersRef = ref(database, 'auction/players');
    const teamsRef = ref(database, 'auction/teams');

    const unsubscribePlayers = onValue(playersRef, (snapshot) => {
      const playersData = snapshot.val();
      const playersArray = Object.entries(playersData || {}).map(([id, player]) => ({
        id,
        ...player
      }));
      setPlayers(playersArray);
      setLoading(false);
    });

    const unsubscribeTeams = onValue(teamsRef, (snapshot) => {
      const teamsData = snapshot.val();
      const teamArray = Object.entries(teamsData || {}).map(([id, team]) => ({ id, ...team }));
      setTeams(teamArray);
    });

    return () => {
      unsubscribePlayers();
      unsubscribeTeams();
    };
  }, []);

  const handleBidUpdate = async (playerId) => {
    if (!selectedPlayer || bidAmount <= selectedPlayer.currentBid) {
      setError('Bid amount must be higher than current bid');
      return;
    }

    try {
      const updates = {};
      const timestamp = Date.now();

      updates[`auction/players/${playerId}/currentBid`] = bidAmount;

      const bidHistoryRef = ref(database, `auction/bids/${playerId}/history`);
      const newBidKey = push(bidHistoryRef).key;
      updates[`auction/bids/${playerId}/history/${newBidKey}`] = {
        amount: bidAmount,
        timestamp,
        status: 'pending'
      };

      await update(ref(database), updates);
      setError('');
      alert('Bid updated successfully!');
    } catch (error) {
      console.error('Error updating bid:', error);
      setError('Failed to update bid');
    }
  };

  const assignPlayerToTeam = async () => {
    try {
      if (!selectedPlayer || !selectedTeamId) {
        setError('Please select both a player and a team');
        return;
      }

      const team = teams.find(t => t.id === selectedTeamId);

      if (!team) {
        setError('Invalid team selection');
        return;
      }

      if (team.budget < selectedPlayer.currentBid) {
        setError('Team does not have enough budget');
        return;
      }

      const updates = {};

      updates[`auction/players/${selectedPlayer.id}/teamId`] = selectedTeamId;
      updates[`auction/players/${selectedPlayer.id}/status`] = 'sold';

      updates[`auction/teams/${selectedTeamId}/players/${selectedPlayer.id}`] = true;
      updates[`auction/teams/${selectedTeamId}/budget`] = team.budget - selectedPlayer.currentBid;

      await update(ref(database), updates);
      setError('');
      setSelectedTeamId('');
      alert('Player assigned successfully!');

      const updatedPlayers = players.map(p =>
        p.id === selectedPlayer.id
          ? { ...p, teamId: selectedTeamId, status: 'sold' }
          : p
      );
      setPlayers(updatedPlayers);
      setSelectedPlayer(updatedPlayers.find(p => p.id === selectedPlayer.id));
    } catch (error) {
      console.error('Assignment error:', error);
      setError('Failed to assign player');
    }
  };

  if (loading) return <div className="loading">Loading auction data...</div>;

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="player-management">
          <div className="player-grid">
          {players.map(player => (
            <div
              key={player.id}
              className={`player-card ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedPlayer(player);
                setBidAmount(player.currentBid + 0.25);
                setSelectedTeamId('');

                // Set current player in Firebase
                const currentPlayerRef = ref(database, 'auction/currentPlayer');
                set(currentPlayerRef, {
                  id: player.id,
                  name: player.name
                });
              }}
            >
              <div className="player-image">
                <img src={player.imageUrl || '/default-player.png'} alt={player.name} />
              </div>
              <div className="player-info">
                <h3>{player.name}</h3>
                <p>Role: {player.role}</p>
                <p>Status: <span className={`status-${player.status}`}>{player.status}</span></p>
                <p>Current Bid: ₹{player.currentBid} Cr</p>
                <p>Points: {player.points || 'N/A'}</p>
                {player.teamId && <p>Team: {teams.find(t => t.id === player.teamId)?.name || player.teamId}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="player-detail-view">
          <div className="player-detail-card">
            <div className="player-image-large">
              <img src={selectedPlayer.imageUrl || '/default-player.png'} alt={selectedPlayer.name} />
            </div>
            <div className="player-detail-info">
              <h2>{selectedPlayer.name}</h2>
              <div className="detail-row">
                <span className="detail-label">Role:</span>
                <span>{selectedPlayer.role}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-${selectedPlayer.status}`}>{selectedPlayer.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Current Bid:</span>
                <span>
  ₹{players.find(p => p.id === selectedPlayer.id)?.currentBid || selectedPlayer.currentBid} Cr
</span>

              </div>
              <div className="detail-row">
                <span className="detail-label">Points:</span>
                <span>{selectedPlayer.points || 'N/A'}</span>
              </div>
              {selectedPlayer.teamId && (
                <div className="detail-row">
                  <span className="detail-label">Team:</span>
                  <span>{teams.find(t => t.id === selectedPlayer.teamId)?.name || selectedPlayer.teamId}</span>
                </div>
              )}

              <div className="admin-controls">
                <div className="bid-control">
                  <label>
                    New Bid Amount (₹ Cr):
                    <input
                      type="number"
                      min={selectedPlayer.currentBid + 0.25}
                      step="0.25"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                    />
                  </label>
                  <button onClick={() => handleBidUpdate(selectedPlayer.id)}>
                    Update Bid
                  </button>
                </div>

                <div className="team-assignment">
                  <label>
                    Assign to Team:
                    <select
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      disabled={selectedPlayer.status === 'sold'}
                    >
                      <option value="">Select team</option>
                      {teams.map(team => (
                        <option
                          key={team.id}
                          value={team.id}
                          disabled={team.budget < selectedPlayer.currentBid || selectedPlayer.status === 'sold'}
                        >
                          {team.name} (₹{team.budget} Cr left)
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    onClick={assignPlayerToTeam}
                    disabled={!selectedTeamId || selectedPlayer.status === 'sold'}
                  >
                    Assign Player
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
