import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import * as client from './api/client';

vi.mock('./api/client', () => ({
    getMenu: vi.fn(),
    getOffers: vi.fn(),
    getLocations: vi.fn(),
    getUserOrders: vi.fn()
}));

describe('App component', () => {
    it('renders the order mgmt logic without crashing', async () => {
        vi.mocked(client.getMenu).mockResolvedValue([{ id: 1, name: "Burger", price: 100, description: "Tasty", image_url: "" }]);
        vi.mocked(client.getOffers).mockResolvedValue([]);
        vi.mocked(client.getLocations).mockResolvedValue([]);

        render(<App />);

        // Let menu load 
        const linkElement = await screen.findByText(/Home/i);
        expect(linkElement).toBeInTheDocument();
    });
});
