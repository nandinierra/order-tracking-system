import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

export const updateOrderStatus = async (id) => {
    const response = await api.put(`/orders/${id}`);
    return response.data;
};

export default api;
