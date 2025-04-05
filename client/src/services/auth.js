import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api/auth';

// Store the current mock users to ensure sync with server
let localMockUsers = [];

// Get the existing token
export const getToken = () => localStorage.getItem('authToken');

// Get current user info from token
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('Auth Service: No token found');
      return null;
    }

    console.log('Auth Service: Fetching current user with token');
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error('Auth Service: Failed to get user data', response.status);
      throw new Error('Failed to get user data');
    }

    const userData = await response.json();
    console.log('Auth Service: User data retrieved successfully');
    return userData;
  } catch (error) {
    console.error('Auth Service: Error getting current user', error);
    // On error, clear the invalid token
    localStorage.removeItem('authToken');
    return null;
  }
};

// Login user and get token
export const loginUser = async (email, password) => {
  try {
    console.log(`Auth Service: Logging in ${email}`);
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Auth Service: Login failed', response.status);
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Auth Service: Login successful, token received');
    
    // Store the token
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Auth Service: Login error', error);
    throw error;
  }
};

// Register new user
export const registerUser = async (userData) => {
  try {
    console.log('Auth Service: Registering new user');
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Auth Service: Registration failed', response.status);
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    console.log('Auth Service: Registration successful');
    return data;
  } catch (error) {
    console.error('Auth Service: Registration error', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('Auth Service: Sending logout request');
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
    
    console.log('Auth Service: Removing auth token');
    localStorage.removeItem('authToken');
    return { success: true };
  } catch (error) {
    console.error('Auth Service: Logout error', error);
    // Still clear token on error
    localStorage.removeItem('authToken');
    return { success: true };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};