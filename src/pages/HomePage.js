import React, {  useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/HomePage.css';

const HomePage = () => {
  useEffect(() => {
  }, []);

  return (
    <div className="home-page">
      <Header/>
      <section className="hero-section">
  <div className="hero-content">
    <h1>HyperStrike 2025 IPL Auction</h1>
    <p>The biggest cricket extravaganza is back with a mega player auction</p>
    <div className="cta-buttons">
      <Link to="/UserPage" className="btn-primary">Start Auction</Link>
    </div>
  </div>
</section>
    </div>
  );
};

export default HomePage;