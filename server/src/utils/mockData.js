/**
 * Mock data for development when database connection fails
 */
const mockTasks = [
  {
    _id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the task manager project',
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

// Maintain an in-memory store of tasks for the mock API
let tasks = [...mockTasks];

module.exports = {
  getTasks: () => [...tasks],
  getTaskById: (id) => tasks.find(task => task._id === id),
  createTask: (taskData) => {
    const newTask = {
      _id: (tasks.length + 1).toString(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tasks.push(newTask);
    return newTask;
  },
  updateTask: (id, taskData) => {
    const index = tasks.findIndex(task => task._id === id);
    if (index === -1) return null;
    
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date()
    };
    tasks[index] = updatedTask;
    return updatedTask;
  },
  deleteTask: (id) => {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task._id !== id);
    return initialLength !== tasks.length;
  },
  resetTasks: () => {
    tasks = [...mockTasks];
    return true;
  }
};