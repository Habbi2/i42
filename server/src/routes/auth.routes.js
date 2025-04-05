const express = require('express');
const router = express.Router();

// Create a shared mock users array so registration can add to it
const mockUsers = [
  { id: '123456', email: 'user@example.com', password: 'password123', name: 'Test User' },
  { id: '789012', email: 'admin@example.com', password: 'admin123', name: 'Admin User' }
];

// Add to the top of your file
const tokenStore = new Map();

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

// Update your login route
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
    
    // Generate token - make it more unique
    const token = 'mock_jwt_token_' + user.id + '_' + Math.random().toString(36).substring(2);
    
    // Store token with user ID
    tokenStore.set(token, user.id);
    console.log(`Token created for user ${user.email}:`, token.substring(0, 15) + '...');
    
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

// Update your me route to use the token store
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = tokenStore.get(token);
    
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Find the user by ID
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Add a logout route that removes the token
router.post('/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      tokenStore.delete(token);
      console.log('Token removed during logout');
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    res.json({ success: true });
  }
});

module.exports = router;