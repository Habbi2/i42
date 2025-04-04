import React from 'react';
import TaskList from '../components/tasks/TaskList';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { currentUser } = useAuth();

    return (
        <div>
            <div className="welcome-section" style={{ 
                textAlign: 'center',
                padding: '40px 20px',
                marginBottom: '30px'
            }}>
                <h1 style={{ 
                    fontSize: '2.5rem',
                    marginBottom: '20px',
                    color: '#333'
                }}>Welcome to the Task Manager</h1>
                
                <p style={{ 
                    fontSize: '1.2rem',
                    maxWidth: '800px',
                    margin: '0 auto 30px',
                    color: '#666'
                }}>
                    A simple and efficient way to organize your tasks and boost your productivity.
                </p>
                
                {!currentUser && (
                    <div style={{ marginTop: '20px' }}>
                        <Link to="/auth" style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            marginRight: '10px'
                        }}>
                            Get Started
                        </Link>
                    </div>
                )}
            </div>

            {currentUser && <TaskList />}
        </div>
    );
};

export default Home;