import axios from 'axios';

// Consistent API URL
const API_BASE_URL = 'http://localhost:5000/api';
const AUTH_URL = `${API_BASE_URL}/auth`;

// Authentication service functions
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if the response is not OK (4xx or 5xx status)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    // If response is OK, parse the data
    const data = await response.json();
    
    // Store token in localStorage - use consistent name
    localStorage.setItem('authToken', data.token);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Re-throw to let components handle it
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    
    // Don't automatically log in after registration
    // Let the user log in explicitly with their credentials
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Use consistent name
    if (!token) return null;
    
    const response = await fetch(`${AUTH_URL}/me`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return await response.json();
  } catch (error) {
    console.error('Get current user error:', error);
    localStorage.removeItem('authToken'); // Use consistent name
    return null;
  }
};

export const logoutUser = async () => {
  localStorage.removeItem('authToken'); // Use consistent name
  return { success: true };
};