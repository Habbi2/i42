import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskForm from './TaskForm';
import { Link } from 'react-router-dom';

const TaskItem = ({ task }) => {
  const { removeTask } = useTasks();
  const [showEditForm, setShowEditForm] = useState(false);

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'completed') return 'status-completed';
    if (statusLower === 'in-progress' || statusLower === 'started') return 'status-in-progress';
    if (statusLower === 'backlog') return 'status-backlog';
    return 'status-pending'; // Default for unstarted or unknown
  };

  const getPriorityClass = (priority) => {
    const priorityLower = priority?.toLowerCase();
    if (priorityLower === 'high' || priorityLower === 'urgent') return 'priority-high';
    if (priorityLower === 'medium') return 'priority-medium';
    return 'priority-low';
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await removeTask(task._id);
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  return (
    <>
      <div className="task-item">
        <div className="task-header">
          <h3>{task.title}</h3>
          <div className={`task-status ${getStatusClass(task.status)}`}>
            {task.status || 'Pending'}
          </div>
        </div>
        
        <p className="task-description">{task.description}</p>
        
        <div className="task-details">
          {task.priority && (
            <span className={`task-priority ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
          )}
          
          {task.dueDate && (
            <span className="task-due-date">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <div className="task-actions">
          <button 
            className="btn btn-view"
            onClick={() => alert(`Task ID: ${task._id}`)}
          >
            View
          </button>
          <button 
            className="btn btn-edit"
            onClick={() => setShowEditForm(true)}
          >
            Edit
          </button>
          <button 
            onClick={handleDelete} 
            className="btn btn-delete"
          >
            Delete
          </button>
        </div>
      </div>

      {showEditForm && (
        <TaskForm 
          taskId={task._id} 
          onClose={() => setShowEditForm(false)} 
        />
      )}
    </>
  );
};

export default TaskItem;