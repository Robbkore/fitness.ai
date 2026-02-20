import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App Routing & Landing Page', () => {
    it('renders the landing page initially', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        );

        // The landing page should have "Welcome to Fitness.ai" and a "Get Started" button
        expect(screen.getByText('Welcome to Fitness.ai')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
    });
});
