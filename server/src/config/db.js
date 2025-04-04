const mongoose = require('mongoose');
require('dotenv').config();

// Connection options with better timeout and retry settings
const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000, // Increase timeout
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB with retry logic
const connectDB = async () => {
  let retries = 5;
  
  while (retries) {
    try {
      console.log('Attempting to connect to MongoDB...');
      
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager', connectOptions);
      
      console.log('MongoDB connected successfully');
      return;
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      
      retries -= 1;
      if (retries === 0) {
        console.error('Maximum retries reached. Could not connect to MongoDB');
        process.exit(1);
      }
      
      // Wait before retrying
      console.log(`Retrying connection in 5 seconds... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Handle connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;