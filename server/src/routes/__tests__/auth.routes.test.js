const request = require('supertest');
const express = require('express');
const cors = require('cors');
const authRoutes = require('../auth.routes');

// Create a test app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  it('POST /api/auth/register should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'newuser@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', userData.name);
    expect(response.body).toHaveProperty('email', userData.email);
    expect(response.body).not.toHaveProperty('password');
  });

  it('POST /api/auth/register should return 400 if email exists', async () => {
    // Register a user first
    const userData = {
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'password123'
    };
    
    await request(app).post('/api/auth/register').send(userData);
    
    // Try to register with the same email
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Email already in use');
  });

  it('POST /api/auth/login should authenticate a valid user', async () => {
    // First register a user to ensure they exist
    const userData = {
      name: 'Login Test User',
      email: 'logintest@example.com',
      password: 'password123'
    };
    
    await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    // Now try to login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });
    
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('email', userData.email);
  });

  it('POST /api/auth/login should return 401 for invalid credentials', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });
    
    expect(loginResponse.statusCode).toBe(401);
    expect(loginResponse.body).toHaveProperty('message');
  });

  it('GET /api/auth/me should return user data for authenticated user', async () => {
    // Register and login first to get token
    const userData = {
      name: 'Me Test User',
      email: 'metest@example.com',
      password: 'password123'
    };
    
    await request(app).post('/api/auth/register').send(userData);
    
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });
    
    const token = loginResponse.body.token;
    
    // Test /me endpoint
    const meResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.body).toHaveProperty('name', userData.name);
    expect(meResponse.body).toHaveProperty('email', userData.email);
  });

  it('GET /api/auth/me should return 401 without token', async () => {
    const response = await request(app).get('/api/auth/me');
    
    expect(response.statusCode).toBe(401);
  });

  it('POST /api/auth/logout should clear token', async () => {
    // Register and login first
    const userData = {
      name: 'Logout Test User',
      email: 'logouttest@example.com',
      password: 'password123'
    };
    
    await request(app).post('/api/auth/register').send(userData);
    
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });
    
    const token = loginResponse.body.token;
    
    // Test logout endpoint
    const logoutResponse = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    
    expect(logoutResponse.statusCode).toBe(200);
    expect(logoutResponse.body).toHaveProperty('success', true);
    
    // Verify token is invalidated by trying to access /me
    const meResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(meResponse.statusCode).toBe(401);
  });
});