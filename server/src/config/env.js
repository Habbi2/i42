require('dotenv').config();

const env = {
    PORT: process.env.PORT || 5000,
    DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/task-manager',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    NODE_ENV: process.env.NODE_ENV || 'development',
};

module.exports = env;