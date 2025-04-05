import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Auth routes - redirect to dashboard if already logged in */}
          <Route 
            path="/auth" 
            element={!currentUser ? <Auth initialView="login" /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/auth/login" 
            element={!currentUser ? <Auth initialView="login" /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/auth/register" 
            element={!currentUser ? <Auth initialView="register" /> : <Navigate to="/dashboard" />} 
          />
          
          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/tasks/:id" element={
            <ProtectedRoute>
              <TaskDetails />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
};

export default App;