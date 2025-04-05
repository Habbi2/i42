import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import LoginForm from '../LoginForm';

describe('LoginForm', () => {
  const mockSubmit = jest.fn();
  
  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders login form correctly', () => {
    render(<LoginForm onSubmit={mockSubmit} loading={false} />);
    
    // Check form elements
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays loading state when loading prop is true', () => {
    render(<LoginForm onSubmit={mockSubmit} loading={true} />);
    
    // Check if button is disabled and shows loading text
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/signing in/i);
  });

  it('pre-fills email field when initialEmail is provided', () => {
    render(<LoginForm onSubmit={mockSubmit} loading={false} initialEmail="test@example.com" />);
    
    // Check if email field is pre-filled
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
  });

  it('submits the form with correct data', async () => {
    render(<LoginForm onSubmit={mockSubmit} loading={false} />);
    
    // Fill in form fields
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check if onSubmit was called with the right data
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123'
    });
  });

  it('shows error message when submission fails', async () => {
    const errorMockSubmit = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    
    render(<LoginForm onSubmit={errorMockSubmit} loading={false} />);
    
    // Fill in form fields and submit
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});