import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
    const mockItem = {
        id: 1,
        name: 'Pizza',
        description: 'Test',
        price: 10,
        image_url: 'test.jpg',
    };

    it('adds items to cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(mockItem);
        });

        expect(result.current.cart).toHaveLength(1);
        expect(result.current.cart[0].quantity).toBe(1);
        expect(result.current.total).toBe(10);
    });

    it('updates quantity', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(mockItem);
            result.current.updateQuantity(1, 3);
        });

        expect(result.current.cart[0].quantity).toBe(3);
        expect(result.current.total).toBe(30);
    });

    it('removes items', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(mockItem);
            result.current.removeFromCart(1);
        });

        expect(result.current.cart).toHaveLength(0);
    });
});
