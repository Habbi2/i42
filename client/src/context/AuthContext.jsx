import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser as loginUserService, logoutUser as logoutUserService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (on page load)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if there's a token in localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }
        
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        // Clear any invalid tokens
        localStorage.removeItem('authToken');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  // Login function (to be used by components)
  const login = async (email, password) => {
    setError(null);
    try {
      const userData = await loginUserService(email, password);
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutUserService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove token and user data
      localStorage.removeItem('authToken');
      setCurrentUser(null);
    }
  };

  // Value to be provided to components
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;