import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import '../components/auth/Auth.css';

const Auth = ({ initialView }) => {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(initialView === 'register' ? false : true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check for registration success message in URL params or state
    useEffect(() => {
        // Check URL search params
        const params = new URLSearchParams(location.search);
        const messageFromParam = params.get('message');
        
        // Check navigation state
        const messageFromState = location.state?.message;
        const emailFromState = location.state?.email;
        
        if (messageFromParam) {
            setSuccessMessage(messageFromParam);
            setIsLogin(true);
        } else if (messageFromState) {
            setSuccessMessage(messageFromState);
            setIsLogin(true);
            
            if (emailFromState) {
                setRegisteredEmail(emailFromState);
            }
        }
    }, [location]);

    const toggleForm = () => {
        setIsLogin((prev) => !prev);
        setError(null);
        setSuccessMessage(null);
    };

    const handleAuthAction = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);
            
            if (isLogin) {
                // Handle login
                console.log('Auth Page: Attempting login with:', formData.email);
                await login(formData.email, formData.password);
                console.log('Auth Page: Login successful, redirecting');
                navigate('/dashboard');
            } else {
                // Handle registration
                console.log('Auth Page: Attempting registration for:', formData.email);
                await register(formData);
                
                // Store the email for login
                const registeredEmail = formData.email;
                
                // Instead of just setting state, navigate with state to preserve through redirects
                navigate('/auth/login', { 
                    state: { 
                        message: 'Registration successful! Please sign in with your new account.',
                        email: registeredEmail 
                    },
                    replace: true  // Replace the current history entry to prevent back button issues
                });
            }
        } catch (err) {
            console.error('Auth Page: Authentication error', err);
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
                {successMessage && <div className="auth-success">{successMessage}</div>}
                
                {isLogin ? (
                    <LoginForm 
                        onSubmit={handleAuthAction}
                        loading={loading}
                        initialEmail={registeredEmail}
                        key="login-form" // Force re-render when switching
                    />
                ) : (
                    <RegisterForm 
                        onSubmit={handleAuthAction}
                        loading={loading}
                        key="register-form" // Force re-render when switching
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