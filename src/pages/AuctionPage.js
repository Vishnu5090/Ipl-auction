import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import '../styles/AuctionPage.css';

const AuctionPage = () => {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const settingsRef = ref(database, 'auction/settings');
    const unsubscribeSettings = onValue(settingsRef, (settingsSnap) => {
      const settings = settingsSnap.val();
      if (!settings?.currentPlayerId) {
        setError("No active auction found");
        setLoading(false);
        return;
      }

      const playerRef = ref(database, `auction/players/${settings.currentPlayerId}`);
      const unsubscribePlayer = onValue(playerRef, (playerSnap) => {
        const playerData = playerSnap.val();
        if (playerData) {
          setCurrentPlayer(playerData);
        } else {
          setError(`Player ${settings.currentPlayerId} not found`);
        }
      });

      const bidRef = ref(database, `auction/bids/${settings.currentPlayerId}/currentBid`);
      const unsubscribeBid = onValue(bidRef, (bidSnap) => {
        const bidData = bidSnap.val();
        if (bidData) {
          setCurrentBid(bidData.amount || 0);
        }
        setLoading(false);
      });

      return () => {
        unsubscribePlayer();
        unsubscribeBid();
      };
    });

    return () => unsubscribeSettings();
  }, []);

  if (loading) {
    return <div className="loading">Loading auction data...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="auction-container">
      {currentPlayer && (
        <div className="player-card">
          <div className="player-header">
            <div className="player-image">
              <img 
                src={currentPlayer.imageUrl || '/images/default-player.png'} 
                alt={currentPlayer.name} 
              />
            </div>
            <div className="player-info">
              <h1>{currentPlayer.name}</h1>
              <p className="player-role">{currentPlayer.role}</p>
              <div className="player-rank">Rank: {currentPlayer.rank}</div>
            </div>
          </div>

          <div className="player-stats">
            <h3>Batting Statistics</h3>
            <div className="stats-grid">
              <div>Matches: {currentPlayer.stats?.batting?.matches || '-'}</div>
              <div>Runs: {currentPlayer.stats?.batting?.runs || '-'}</div>
              <div>HS: {currentPlayer.stats?.batting?.highestScore || '-'}</div>
              <div>Avg: {currentPlayer.stats?.batting?.average?.toFixed(2) || '-'}</div>
              <div>SR: {currentPlayer.stats?.batting?.strikeRate?.toFixed(2) || '-'}</div>
              <div>100s: {currentPlayer.stats?.batting?.centuries || '-'}</div>
            </div>
          </div>

          <div className="bid-section">
            <h3>Current Bid: ₹{currentBid.toFixed(2)} Cr</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionPage;