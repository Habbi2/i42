import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { loginUser, registerUser } from '../api/auth';
import '../components/auth/Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsLogin((prev) => !prev);
        setError(null); // Clear errors when switching forms
    };

    const handleLogin = async (credentials) => {
        try {
            await loginUser(credentials);
            navigate('/dashboard');
        } catch (err) {
            throw err;
        }
    };

    const handleRegister = async (userData) => {
        try {
            await registerUser(userData);
            navigate('/dashboard');
        } catch (err) {
            throw err;
        }
    };

    const handleAuthAction = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            
            if (isLogin) {
                await handleLogin(formData);
            } else {
                await handleRegister(formData);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                
                {error && <div className="auth-error">{error}</div>}
                
                {isLogin ? (
                    <LoginForm 
                        onSubmit={handleAuthAction}
                        loading={loading}
                    />
                ) : (
                    <RegisterForm 
                        onSubmit={handleAuthAction}
                        loading={loading}
                    />
                )}
                
                <div className="auth-switch">
                    <span>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            className="auth-switch-btn" 
                            onClick={toggleForm}
                            disabled={loading}
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Auth;