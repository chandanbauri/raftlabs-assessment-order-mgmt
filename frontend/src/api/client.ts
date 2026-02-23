import axios from 'axios';
import { Item, Order } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const getMenu = async (): Promise<Item[]> => {
    const response = await axios.get(`${API_BASE_URL}/menu`);
    return response.data;
};

export const createOrder = async (orderData: {
    customer_name: string;
    customer_address: string;
    customer_phone: string;
    items: { item_id: number; quantity: number }[];
}): Promise<Order> => {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return response.data;
};

export const getOrder = async (id: string): Promise<Order> => {
    const response = await axios.get(`${API_BASE_URL}/orders/${id}`);
    return response.data;
};
