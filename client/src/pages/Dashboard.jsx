import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';

const Dashboard = () => {
    const { tasks, loading, error } = useTasks();
    const [showTaskForm, setShowTaskForm] = useState(false);
    
    // Task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const urgentTasks = tasks.filter(task => task.priority === 'Urgent').length;
    
    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Task Dashboard</h1>
                <button 
                    onClick={() => setShowTaskForm(true)}
                    style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#4CAF50', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Create New Task
                </button>
            </div>
            
            {/* Dashboard Stats */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '15px',
                marginBottom: '30px'
            }}>
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#f0f8ff', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h3>Total Tasks</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalTasks}</p>
                </div>
                
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#f0fff0', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h3>Completed</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{completedTasks}</p>
                </div>
                
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#fff0f0', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h3>Urgent Tasks</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{urgentTasks}</p>
                </div>
            </div>
            
            {error && <div style={{ color: 'red', marginBottom: '15px' }}>Error: {error}</div>}
            
            <TaskList />
            
            {showTaskForm && (
                <TaskForm onClose={() => setShowTaskForm(false)} />
            )}
        </div>
    );
};

export default Dashboard;