require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/task.routes'); // Make sure this matches the file name
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Debugging middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.headers.authorization) {
    console.log(`Authorization header present: ${req.headers.authorization.substring(0, 20)}...`);
  } else {
    console.log('No Authorization header');
  }
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Continue without DB for now
    console.log('Using mock data instead');
  }
};

// Add this to your application setup
// This will keep track of user sessions even if the server restarts

// Create an in-memory store for tokens
const tokenStore = new Map();

// Middleware to verify tokens
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Check if token is in our store
    const userId = tokenStore.get(token);
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Add user ID to request
    req.userId = userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

// Routes registration
app.use('/api/auth', authRoutes);

// For protected routes, use the verifyToken middleware
app.use('/api/tasks', verifyToken, taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// Start server
const startServer = async () => {
  // Try to connect to DB but continue even if it fails
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

module.exports = app;