import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../../context/TaskContext';
import './Tasks.css';

const TaskForm = ({ taskId = null, onClose }) => {
  const { getTaskById, addTask, editTask } = useTasks();
  const [loading, setLoading] = useState(taskId !== null);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });

  // Load task data if editing
  useEffect(() => {
    // Skip fetch if no taskId
    if (!taskId) return;
    
    let isMounted = true;
    
    const fetchTask = async () => {
      try {
        const taskData = await getTaskById(taskId);
        
        if (!isMounted) return; // Don't update state if component unmounted
        
        // Format date properly for the input field (YYYY-MM-DD)
        let formattedDueDate = '';
        if (taskData.dueDate) {
          const date = new Date(taskData.dueDate);
          if (!isNaN(date.getTime())) {
            formattedDueDate = date.toISOString().split('T')[0];
          }
        }
        
        setFormData({
          title: taskData.title || '',
          description: taskData.description || '',
          status: taskData.status || 'pending',
          priority: taskData.priority || 'medium',
          dueDate: formattedDueDate
        });
      } catch (err) {
        if (isMounted) {
          console.error("Error loading task:", err);
          setError('Could not load task data. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchTask();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [taskId]); // Only run when taskId changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (taskId) {
        console.log("Updating task...", taskId, formData);
        await editTask(taskId, formData);
      } else {
        await addTask(formData);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Error saving task');
    }
  };

  if (loading) {
    return (
      <div className="task-form-overlay">
        <div className="task-form">
          <div className="form-header">
            <h2>Loading task data...</h2>
            <button type="button" className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="form-body loading">
            <p>Loading task details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <div className="form-header">
          <h2>{taskId ? 'Edit Task' : 'Create New Task'}</h2>
          <button type="button" className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="form-body">
          {error && <div className="form-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select 
                id="status" 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="backlog">Backlog</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select 
                id="priority" 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input 
                type="date" 
                id="dueDate" 
                name="dueDate" 
                value={formData.dueDate} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                {taskId ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;