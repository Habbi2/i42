import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../index.css';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, refreshUser } = useAuth();
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  
  // Debug logs
  useEffect(() => {
    console.log('ProtectedRoute: Auth state:', { 
      isAuthenticated: !!currentUser, 
      loading, 
      user: currentUser ? currentUser.email : null,
      token: localStorage.getItem('authToken') ? 'Present' : 'Missing'
    });
    
    // If we have a token but no user, try to refresh the user data
    if (!currentUser && !loading && localStorage.getItem('authToken')) {
      console.log('ProtectedRoute: Token exists but no user, refreshing user data');
      refreshUser();
    }
  }, [currentUser, loading, refreshUser]);
  
  // Countdown timer for redirect
  useEffect(() => {
    let timer;
    if (!currentUser && !loading && redirectCountdown > 0) {
      timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [currentUser, loading, redirectCountdown]);
  
  // Show loading indicator
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner"></div>
        <p>Verifying your authentication...</p>
      </div>
    );
  }
  
  // Check auth status after loading completes
  if (!currentUser) {
    console.log('ProtectedRoute: Not authenticated, showing auth message');
    
    // Check for token one more time as a fallback
    if (localStorage.getItem('authToken')) {
      return (
        <div className="auth-loading">
          <p>Authentication token found. Verifying...</p>
          <button onClick={refreshUser} className="auth-button primary">
            Retry Authentication
          </button>
        </div>
      );
    }
    
    return (
      <div className="auth-message">
        <div className="auth-message-container">
          <h2>Authentication Required</h2>
          <p>You need to be logged in to access this page.</p>
          
          <div className="auth-message-actions">
            <Link to="/auth/login" className="auth-button primary">
              Sign In
            </Link>
            <Link to="/auth/register" className="auth-button secondary">
              Create Account
            </Link>
          </div>
          
          {redirectCountdown > 0 && (
            <p className="redirect-message">
              Redirecting to login page in {redirectCountdown} seconds...
            </p>
          )}
          {redirectCountdown === 0 && <Navigate to="/auth/login" replace />}
        </div>
      </div>
    );
  }
  
  // User is authenticated, render protected content
  console.log('ProtectedRoute: User authenticated, rendering content');
  return children;
};

export default ProtectedRoute;