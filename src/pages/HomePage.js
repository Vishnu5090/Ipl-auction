import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import TeamCarousel from '../components/TeamCarousel';
import AuctionCountdown from '../components/AuctionCountdown';

import Footer from '../components/Footer';
import '../styles/HomePage.css';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
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

      <AuctionCountdown targetDate="2025-04-15T10:00:00" />
      
      <TeamCarousel currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
      <section className="register-section">
        <h2>Want to Participate in the Auction?</h2>
        <p>Register as a team owner or bidder for the upcoming IPL 2024 auction</p>
        <button className="btn-primary">Register Now</button>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;