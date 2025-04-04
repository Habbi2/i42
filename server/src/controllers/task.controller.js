const Task = require('../models/Task');

// Mock data
const mockTasks = [
  {
    _id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive docs for the task manager project',
    status: 'Started',
    priority: 'High',
    estimate: 4,
    createdAt: new Date('2025-03-25'),
    updatedAt: new Date('2025-03-30')
  },
  {
    _id: '2',
    title: 'Fix UI bugs',
    description: 'Address reported UI issues in the dashboard',
    status: 'Backlog',
    priority: 'Medium',
    estimate: 2,
    createdAt: new Date('2025-03-28'),
    updatedAt: new Date('2025-03-28')
  },
  {
    _id: '3',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality',
    status: 'Completed',
    priority: 'High',
    estimate: 8,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-22')
  },
  {
    _id: '4',
    title: 'Deploy application',
    description: 'Set up CI/CD pipeline and deploy to production',
    status: 'Unstarted',
    priority: 'Urgent',
    estimate: 6,
    createdAt: new Date('2025-04-01'),
    updatedAt: new Date('2025-04-01')
  }
];

// In-memory store
let tasks = [...mockTasks];

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    // Try to get tasks from database if connected
    try {
      const dbTasks = await Task.find();
      return res.status(200).json(dbTasks);
    } catch (dbError) {
      console.log('Using mock data due to database error:', dbError);
      // Fall back to mock data
      return res.status(200).json(tasks);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json(task);
    } catch (dbError) {
      console.log('Using mock data due to database error:', dbError);
      const task = tasks.find(t => t._id === req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json(task);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    try {
      const newTask = new Task(req.body);
      const savedTask = await newTask.save();
      return res.status(201).json(savedTask);
    } catch (dbError) {
      console.log('Using mock data due to database error:', dbError);
      const newTask = {
        _id: (tasks.length + 1).toString(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      tasks.push(newTask);
      return res.status(201).json(newTask);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json(updatedTask);
    } catch (dbError) {
      console.log('Using mock data due to database error:', dbError);
      const taskIndex = tasks.findIndex(t => t._id === req.params.id);
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }
      const updatedTask = {
        ...tasks[taskIndex],
        ...req.body,
        updatedAt: new Date()
      };
      tasks[taskIndex] = updatedTask;
      return res.status(200).json(updatedTask);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    try {
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (dbError) {
      console.log('Using mock data due to database error:', dbError);
      const initialLength = tasks.length;
      tasks = tasks.filter(t => t._id !== req.params.id);
      if (initialLength === tasks.length) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json({ message: 'Task deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};