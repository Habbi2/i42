const express = require('express');
const router = express.Router();

// Create a shared mock users array so registration can add to it
const mockUsers = [
  { id: '123456', email: 'user@example.com', password: 'password123', name: 'Test User' },
  { id: '789012', email: 'admin@example.com', password: 'admin123', name: 'Admin User' }
];

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    if (mockUsers.some(user => user.email === email)) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create a new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, you would hash the password
      createdAt: new Date().toISOString()
    };
    
    // Add the new user to mock users array so they can log in
    mockUsers.push(newUser);
    
    console.log('Registered new user:', email);
    console.log('Current users:', mockUsers.map(u => u.email));
    
    // Return the new user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ message: err.message || 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    console.log('Available users:', mockUsers.map(u => u.email));
    
    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    
    // Check if user exists and password is correct
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate token
    const token = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      ...userWithoutPassword,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // In a real app, you would verify the token
    // For mock implementation, just check if there's an auth header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // In real app, you'd decode JWT and find user by ID
    // For mock implementation, just return a sample user
    res.json({
      id: '123456',
      name: 'Test User',
      email: 'user@example.com'
    });
  } catch (err) {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  // Client handles logout by removing token
  res.json({ success: true });
});

module.exports = router;