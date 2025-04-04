import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchTasks, fetchTaskById, createTask, updateTask, deleteTask } from '../api/api';

// Create and export the context
export const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false); // Track loading status with a ref
  const initialLoadDoneRef = useRef(false); // Track if initial load has been done
  const taskCache = useRef({}); // Add a task cache to prevent redundant fetches

  const loadTasks = async (force = false) => {
    // Skip if already loading or if this isn't a forced refresh and we've already loaded once
    if (isLoadingRef.current || (!force && initialLoadDoneRef.current)) return;
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      const tasksData = await fetchTasks();
      setTasks(tasksData);
      initialLoadDoneRef.current = true; // Mark that we've loaded data
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading tasks');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  const getTaskById = async (id) => {
    try {
      // Return cached task if available to reduce API calls
      if (taskCache.current[id]) {
        return taskCache.current[id];
      }

      setLoading(true);
      setError(null);
      const task = await fetchTaskById(id);
      
      // Cache the task
      taskCache.current[id] = task;
      
      return task;
    } catch (err) {
      console.error('Error getting task by id:', err);
      setError(err.message || 'Failed to fetch task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      return newTask;
    } catch (err) {
      setError(err.message || 'Error creating task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (id, taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTask = await updateTask(id, taskData);
      
      // Update the tasks list with the updated task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === id ? updatedTask : task
        )
      );
      
      // Update cache
      taskCache.current[id] = updatedTask;
      
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to delete the task
      await deleteTask(id);
      
      // Update local state immediately after successful deletion
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      
      return true;
    } catch (err) {
      console.error(`Error deleting task: ${err}`);
      setError(err.message || 'Error deleting task');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load tasks only once when the provider mounts
  useEffect(() => {
    // Use the loadTasks function instead of duplicating logic
    loadTasks();
    
    // Cleanup function
    return () => {
      // Nothing to clean up for the initial load
    };
  }, []); // Empty dependency array means run once on mount

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        loading, 
        error, 
        loadTasks, // Pass this so components can manually refresh
        getTaskById, 
        addTask, 
        editTask, // Make sure this is included
        removeTask 
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};