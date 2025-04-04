import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';
import Auth from './pages/Auth';

const App = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={currentUser ? <Dashboard /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/tasks/:id" 
            element={currentUser ? <TaskDetails /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/auth" 
            element={!currentUser ? <Auth /> : <Navigate to="/dashboard" />} 
          />
        </Routes>
      </main>
    </>
  );
};

export default App;