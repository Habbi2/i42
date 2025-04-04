// Auth API service with mock functionality

// Mock user data
const MOCK_USERS = [
  { id: '1', name: 'Demo User', email: 'demo@example.com', password: 'password123' }
];

// Store the current user in localStorage for persistence
const getStoredUser = () => {
  const storedUser = localStorage.getItem('currentUser');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Flag to use mock auth instead of real API
let useMockAuth = true;

// Base URL for auth requests
const AUTH_BASE_URL = '/api/auth';

// Register a new user
export const registerUser = async (userData) => {
  try {
    if (useMockAuth) {
      // Check if email already exists
      if (MOCK_USERS.some(user => user.email === userData.email)) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user (without storing password in plaintext in a real app)
      const newUser = {
        id: Math.random().toString(36).substring(2),
        name: userData.name,
        email: userData.email,
        password: userData.password // In a real app, this would be hashed
      };
      
      MOCK_USERS.push(newUser);
      
      // Store user info (except password) in localStorage
      const userToStore = { ...newUser };
      delete userToStore.password;
      
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      return userToStore;
    }
    
    const response = await fetch(`${AUTH_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('Registration error:', error);
    if (!useMockAuth) {
      useMockAuth = true;
      return registerUser(userData);
    }
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    if (useMockAuth) {
      // Find user by email and check password
      const user = MOCK_USERS.find(user => 
        user.email === credentials.email && user.password === credentials.password
      );
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Store user info (except password) in localStorage
      const userToStore = { ...user };
      delete userToStore.password;
      
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      return userToStore;
    }
    
    const response = await fetch(`${AUTH_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    if (!useMockAuth) {
      useMockAuth = true;
      return loginUser(credentials);
    }
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    if (useMockAuth) {
      const user = getStoredUser();
      if (!user) {
        throw new Error('Not authenticated');
      }
      return user;
    }
    
    const response = await fetch(`${AUTH_BASE_URL}/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Get current user error:', error);
    if (!useMockAuth) {
      useMockAuth = true;
      return getCurrentUser();
    }
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    if (useMockAuth) {
      localStorage.removeItem('currentUser');
      return { success: true };
    }
    
    const response = await fetch(`${AUTH_BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    
    localStorage.removeItem('currentUser');
    return response.json();
  } catch (error) {
    console.error('Logout error:', error);
    if (!useMockAuth) {
      useMockAuth = true;
      return logoutUser();
    }
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getStoredUser();
};