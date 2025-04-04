import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Task Manager</Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          {currentUser ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <button onClick={handleLogout} className="navbar-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="navbar-link">Login/Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;