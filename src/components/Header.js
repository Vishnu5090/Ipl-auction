import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="site-header">
      <div className="container">
      


        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/players">Players</Link></li>
            <li><Link to="/teams">Teams</Link></li>
            <li><Link to="/rules">Rules</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          {user ? (
            <>
              <span className="welcome-msg">Welcome, {user.email}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;