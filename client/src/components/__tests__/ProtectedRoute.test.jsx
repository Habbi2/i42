import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

// Mock the AuthContext hook
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    // Mock authenticated user
    useAuth.mockReturnValue({
      currentUser: { id: '123', name: 'Test User' },
      loading: false,
    });
    
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    // Check if protected content is rendered
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows loading state when authentication is in progress', () => {
    // Mock loading state
    useAuth.mockReturnValue({
      currentUser: null,
      loading: true,
    });
    
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    // Fix: Check for the exact text that appears in the component
    expect(screen.getByText(/Verifying your authentication/i)).toBeInTheDocument();
  });

  it('shows authentication message when user is not authenticated', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      currentUser: null,
      loading: false,
    });
    
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    // Check if authentication message is shown
    expect(screen.getByText(/Authentication Required/i)).toBeInTheDocument();
    expect(screen.getByText(/You need to be logged in/i)).toBeInTheDocument();
    
    // Check if sign in and create account links are present
    expect(screen.getByRole('link', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Create Account/i })).toBeInTheDocument();
  });
});