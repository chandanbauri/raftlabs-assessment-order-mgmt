import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';


vi.mock('../api/client', () => ({
    getMenu: vi.fn(() => Promise.resolve([
        { id: 1, name: 'Pizza', price: 299, image_url: '', description: 'Veg' }
    ])),
    getOffers: vi.fn(() => Promise.resolve([
        { id: 1, code: 'OFFER50', description: '50% Off' }
    ])),
    getLocations: vi.fn(() => Promise.resolve([
        { id: 1, name: 'Mumbai' }
    ])),
    loginUser: vi.fn(() => Promise.resolve({ email: 'test@test.com', name: 'Tester' }))
}));

describe('Swiggy App Flow', () => {
    it('renders menu and allows searching', async () => {
        render(<App />);
        expect(await screen.findByText('Restaurants with online food delivery')).toBeInTheDocument();
    });

    it('opens login modal and performs login', async () => {
        render(<App />);
        const signInBtn = await screen.findByText('Sign In');
        fireEvent.click(signInBtn);

        expect(screen.getByText('Login to Swiggy')).toBeInTheDocument();

        const loginBtn = screen.getByText('Login to Swiggy');
        fireEvent.click(loginBtn);


        expect(await screen.findByText('Tester')).toBeInTheDocument();
    });

    it('opens location modal', async () => {
        render(<App />);
        const locationBtn = await screen.findByText(/Bengaluru/);
        fireEvent.click(locationBtn);

        expect(screen.getByText('Search Location')).toBeInTheDocument();
        expect(await screen.findByText('Mumbai')).toBeInTheDocument();
    });
});
