import React, { useState, useEffect } from 'react';
import './Auth.css';

const LoginForm = ({ onSubmit, loading, initialEmail = '' }) => {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // When initialEmail changes (like after registration), update the state
    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail);
        }
    }, [initialEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            await onSubmit({ email, password });
            // If login successful, the parent component will handle redirection
        } catch (err) {
            setError(err.message || 'Failed to log in. Please check your credentials.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                    <input
                        type="password"
                        id="password"
                        className="form-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="current-password"
                    />
                </div>
                <div className="forgot-password">
                    <a href="/forgot-password" className="forgot-link">Forgot password?</a>
                </div>
            </div>
            
            <button 
                type="submit" 
                className={`submit-button ${loading ? 'loading' : ''}`}
                disabled={loading}
            >
                {loading ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
};

export default LoginForm;