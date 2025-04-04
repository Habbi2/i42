// API service with mock data fallback

// Mock data for when DB connection fails
const MOCK_TASKS = [
  { _id: '1', title: 'Complete project', description: 'Finish the task manager app', status: 'in-progress', priority: 'high', dueDate: '2025-04-15' },
  { _id: '2', title: 'Learn React', description: 'Study React hooks and context', status: 'completed', priority: 'medium', dueDate: '2025-04-01' },
  { _id: '3', title: 'Database setup', description: 'Configure MongoDB connection', status: 'pending', priority: 'high', dueDate: '2025-04-10' },
  { _id: '4', title: 'API testing', description: 'Test all API endpoints', status: 'pending', priority: 'medium', dueDate: '2025-04-20' }
];

// Flag to toggle between API and mock data
let useMockData = false; // Set to true to force mock data
let hasLoggedMockDataMessage = false; // Track if we've already logged the message

// Helper to generate new IDs for mock data
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Base URL for all API requests
const API_BASE_URL = 'http://localhost:5000/api';

// When there's an error fetching tasks
export const fetchTasks = async () => {
  try {
    if (useMockData) {
      // Only log once to avoid console spam
      if (!hasLoggedMockDataMessage) {
        console.log('Using mock task data');
        hasLoggedMockDataMessage = true;
      }
      return [...MOCK_TASKS];
    }
    
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Don't log every time, just set the flag 
    if (!hasLoggedMockDataMessage) {
      console.log('Falling back to mock data');
      hasLoggedMockDataMessage = true;
    }
    useMockData = true;
    // Just return mock data, don't make another API call
    return [...MOCK_TASKS];
  }
};

// Fetch a specific task by ID
export const fetchTaskById = async (id) => {
  try {
    if (useMockData) {
      const task = MOCK_TASKS.find(task => task._id === id);
      if (!task) throw new Error(`Task with ID ${id} not found`);
      return {...task};
    }
    
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch task with ID: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    
    // Instead of recursive call, set flag and use mock data directly
    useMockData = true;
    const task = MOCK_TASKS.find(task => task._id === id);
    if (!task) throw new Error(`Task with ID ${id} not found`);
    return {...task};
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    if (useMockData) {
      const newTask = {
        _id: generateId(),
        ...taskData,
        createdAt: new Date().toISOString()
      };
      MOCK_TASKS.push(newTask);
      return {...newTask};
    }
    
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    
    // Instead of recursive call, set flag and use mock data directly
    useMockData = true;
    const newTask = {
      _id: generateId(),
      ...taskData,
      createdAt: new Date().toISOString()
    };
    MOCK_TASKS.push(newTask);
    return {...newTask};
  }
};

// Update an existing task
export const updateTask = async (id, taskData) => {
  console.log(`Updating task ${id} with data:`, taskData);
  
  try {
    if (useMockData) {
      console.log("Using mock data for update");
      const index = MOCK_TASKS.findIndex(task => task._id === id);
      if (index === -1) throw new Error(`Task with ID ${id} not found`);
      
      const updatedTask = {
        ...MOCK_TASKS[index],
        ...taskData,
        _id: id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      };
      
      MOCK_TASKS[index] = updatedTask;
      console.log("Mock task updated:", updatedTask);
      return {...updatedTask};
    }
    
    console.log(`Sending PUT request to ${API_BASE_URL}/tasks/${id}`);
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update task with ID: ${id}`);
    }
    const result = await response.json();
    console.log("Task updated via API:", result);
    return result;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    
    // Instead of recursive call, set flag and use mock data directly
    useMockData = true;
    const index = MOCK_TASKS.findIndex(task => task._id === id);
    if (index === -1) throw new Error(`Task with ID ${id} not found`);
    
    const updatedTask = {
      ...MOCK_TASKS[index],
      ...taskData,
      _id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    MOCK_TASKS[index] = updatedTask;
    console.log("Task updated via mock data after API failure:", updatedTask);
    return {...updatedTask};
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    if (useMockData) {
      const index = MOCK_TASKS.findIndex(task => task._id === id);
      if (index === -1) throw new Error(`Task with ID ${id} not found`);
      
      MOCK_TASKS.splice(index, 1);
      return { success: true, message: 'Task deleted successfully' };
    }
    
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete task with ID: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    
    // Instead of recursive call, set flag and use mock data directly
    useMockData = true;
    const index = MOCK_TASKS.findIndex(task => task._id === id);
    if (index === -1) throw new Error(`Task with ID ${id} not found`);
    
    MOCK_TASKS.splice(index, 1);
    return { success: true, message: 'Task deleted successfully' };
  }
};