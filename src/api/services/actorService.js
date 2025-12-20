// src/api/services/actorService.js
import client from '../client';
import { ENDPOINTS } from '../config/config';

export const getActors = async () => {
    const response = await client.get(ENDPOINTS.actors.list);
    return response.data;
};

export const getActor = async (id) => {
    const response = await client.get(ENDPOINTS.actors.detail(id));
    return response.data;
};

export const createActor = async (data) => {
    const response = await client.post(ENDPOINTS.actors.list, data);
    return response.data;
};