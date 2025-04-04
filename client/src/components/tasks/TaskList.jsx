import React, { memo } from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskItem from './TaskItem';
import './Tasks.css';

// Use React.memo to prevent unnecessary re-renders
const TaskList = memo(() => {
  const { tasks, loading, error, loadTasks } = useTasks();

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button onClick={() => loadTasks(true)}>Try Again</button>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <div className="no-tasks">No tasks found. Create your first task!</div>;
  }

  return (
    <div className="task-list">
      <h2>Your Tasks</h2>
      <div className="task-items">
        {tasks.map(task => (
          <TaskItem key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
});

export default TaskList;