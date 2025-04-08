import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>IPL Auction 2024</h3>
          <p>The official player auction platform for the Indian Premier League 2024 season.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/players">Players</a></li>
            <li><a href="/teams">Teams</a></li>
            <li><a href="/rules">Auction Rules</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@iplauction.com</p>
          <p>Phone: +91 1234567890</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
          
  <h4>Follow Us</h4>
  <ul>
    <li><a href="https://twitter.com/ipl" target="_blank" rel="noopener noreferrer">Twitter</a></li>
    <li><a href="https://instagram.com/ipl" target="_blank" rel="noopener noreferrer">Instagram</a></li>
    <li><a href="https://facebook.com/ipl" target="_blank" rel="noopener noreferrer">Facebook</a></li>
  </ul>
</div>

        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} IPL Auction. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;