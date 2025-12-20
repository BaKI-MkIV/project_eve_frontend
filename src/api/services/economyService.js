// src/api/services/economyService.js
import client from '../client';
import { ENDPOINTS } from '../config';

export const getProducts = async () => {
    const response = await client.get(ENDPOINTS.economy.products);
    return response.data;
};

export const getProduct = async (id) => {
    const response = await client.get(ENDPOINTS.economy.productDetail(id));
    return response.data;
};

export const createProduct = async (data) => {
    const response = await client.post(ENDPOINTS.economy.products, data);
    return response.data;
};

export const getCurrencies = async () => {
    const response = await client.get(ENDPOINTS.economy.currencies);
    return response.data;
};

export const getTags = async () => {
    const response = await client.get(ENDPOINTS.economy.tags);
    return response.data;
};