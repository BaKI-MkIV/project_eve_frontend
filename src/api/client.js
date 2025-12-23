// src/api/client.js
import axios from 'axios';

const API_BASE = 'https://evebend.itsconstant.site';


const client = axios.create({
    baseURL: API_BASE, // Или process.env.REACT_APP_API_URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: добавляем токен к каждому запросу
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Опционально: обработка 401 (просрочен токен)
// client.interceptors.response.use(...)

export default client;