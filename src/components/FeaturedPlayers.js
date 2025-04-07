import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FeaturedPlayers.css';

const FeaturedPlayers = ({ players }) => {
  return (
    <section className="featured-players">
      <div className="section-header">
        <h2>Featured Players</h2>
        <Link to="/players" className="view-all">View All Players →</Link>
      </div>
      <div className="players-grid">
        {players.map(player => (
          <div key={player.id} className="player-card">
            <div className="player-image">
              <img src={`/images/players/${player.photo}`} alt={player.name} />
            </div>
            <div className="player-info">
              <h3>{player.name}</h3>
              <p className="team">{player.team}</p>
              <p className="price">Base Price: {player.basePrice}</p>
              <button className="btn-outline">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedPlayers;