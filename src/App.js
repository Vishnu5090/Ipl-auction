import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import UserPage from './pages/UserPage.js';
import AdminPage from './pages/AdminPage';
import TeamViewPage from './pages/TeamViewPage.js';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/UserPage" element={<UserPage />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/TeamViewPage" element={<TeamViewPage />} />
      </Routes>
    </div>
  );
}

export default App;

