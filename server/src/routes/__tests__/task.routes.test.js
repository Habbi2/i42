const request = require('supertest');
const express = require('express');
const taskRoutes = require('../task.routes');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes); // Apply routes

describe('Task Routes', () => {
  it('GET /api/tasks should return a list of tasks', async () => {
    const response = await request(app).get('/api/tasks');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/tasks/:id should return a specific task', async () => {
    const response = await request(app).get('/api/tasks/1');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', '1');
  });

  it('POST /api/tasks should create a new task', async () => {
    const taskData = {
      title: 'New Task',
      description: 'New Task Description',
      status: 'pending'
    };
    
    const response = await request(app)
      .post('/api/tasks')
      .send(taskData);
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('title', taskData.title);
  });

  it('PUT /api/tasks/:id should update a task', async () => {
    const updateData = {
      title: 'Updated Task',
      status: 'completed'
    };
    
    const response = await request(app)
      .put('/api/tasks/1')
      .send(updateData);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', '1');
    expect(response.body).toHaveProperty('title', updateData.title);
    expect(response.body).toHaveProperty('status', updateData.status);
  });

  it('DELETE /api/tasks/:id should delete a task', async () => {
    const response = await request(app).delete('/api/tasks/1');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Task deleted successfully');
  });
});