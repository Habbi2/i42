import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing user session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        console.log('AuthContext: Checking for existing auth token...');
        
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.log('AuthContext: No token found, user is not authenticated');
          setCurrentUser(null);
          setLoading(false);
          return;
        }
        
        console.log('AuthContext: Token found, fetching user data');
        const userData = await getCurrentUser();
        
        if (userData) {
          console.log('AuthContext: Successfully retrieved user data:', userData.email);
          setCurrentUser(userData);
        } else {
          console.log('AuthContext: Could not retrieve user data, clearing token');
          localStorage.removeItem('authToken');
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('AuthContext: Error checking authentication', err);
        localStorage.removeItem('authToken');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('AuthContext: Attempting login for', email);
      const userData = await loginUser(email, password);
      
      console.log('AuthContext: Login successful, setting current user');
      setCurrentUser(userData);
      
      return userData;
    } catch (err) {
      console.error('AuthContext: Login error', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('AuthContext: Attempting registration for', userData.email);
      const result = await registerUser(userData);
      
      console.log('AuthContext: Registration successful');
      return result;
    } catch (err) {
      console.error('AuthContext: Registration error', err);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      console.log('AuthContext: Logging out user');
      await logoutUser();
      
      console.log('AuthContext: Removing user data and token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
    } catch (err) {
      console.error('AuthContext: Logout error', err);
      // Still remove token even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Value to be provided to components
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;