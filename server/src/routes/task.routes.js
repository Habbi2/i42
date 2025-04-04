const express = require('express');
const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  try {
    // Temporarily return mock data until we set up the models
    res.json([
      { _id: '1', title: 'Task 1', description: 'Description 1', status: 'pending' },
      { _id: '2', title: 'Task 2', description: 'Description 2', status: 'completed' }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single task
router.get('/:id', async (req, res) => {
  try {
    // Mock response
    res.json({ _id: req.params.id, title: 'Sample Task', description: 'Sample Description', status: 'pending' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a task
router.post('/', async (req, res) => {
  try {
    // Mock response - normally would create in DB
    const newTask = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a task
router.put('/:id', async (req, res) => {
  try {
    // Mock response - normally would update in DB
    const updatedTask = {
      _id: req.params.id,
      ...req.body,
      updatedAt: new Date()
    };
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    // Mock deletion - would delete from DB
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;