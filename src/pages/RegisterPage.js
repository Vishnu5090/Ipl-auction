import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase';
import '../styles/AuthPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    teamName: '',
    teamShortName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!formData.teamName.trim()) {
      return setError('Team name is required');
    }
    if (!formData.teamShortName.trim()) {
      return setError('Team short name is required (e.g., MI, CSK)');
    }

    setError('');
    setLoading(true);

    try {
      // 1. Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // 2. Create team in database
      const teamId = formData.teamShortName.toLowerCase();
      const teamData = {
        name: formData.teamName.trim(),
        shortName: formData.teamShortName.trim().toUpperCase(),
        owner: userCredential.user.uid,
        createdAt: new Date().toISOString()
      };
      
      await set(ref(database, `teams/${teamId}`), teamData);
      
      // 3. Save user data with team reference
      await set(ref(database, `users/${userCredential.user.uid}`), {
        email: formData.email,
        teamId,
        role: 'owner',
        createdAt: new Date().toISOString()
      });
      
      navigate('/');
    } catch (err) {
      setError(err.message.includes('email-already-in-use') 
        ? 'Email already registered' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Your Team</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Password fields */}
          <div className="form-group">
            <label>Password (min 6 characters):</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Team name fields */}
          <div className="form-group">
            <label>Team Name:</label>
            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              placeholder="e.g., Mumbai Indians"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Team Short Name (3-4 letters):</label>
            <input
              type="text"
              name="teamShortName"
              value={formData.teamShortName}
              onChange={handleChange}
              placeholder="e.g., MI"
              minLength="2"
              maxLength="4"
              required
            />
            <small className="hint">This will be your team ID (e.g., MI, CSK, RCB)</small>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Team...' : 'Register Team'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have a team? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;