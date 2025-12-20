// src/api/services/authService.js
import client from '../client';
import { ENDPOINTS } from '../config/config';

export const loginUser = async (login, password) => {
    const response = await client.post(ENDPOINTS.auth.login, { login, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    return { access, refresh };
};

export const fetchCurrentUser = async () => {
    const response = await client.get(ENDPOINTS.auth.me);
    return response.data;
};

export const fetchCurrentActor = async () => {
    // Предполагаем, что /auth/me/ возвращает поле actor или actor_id
    // Если нет — сделаем отдельный эндпоинт, но пока попробуем так
    const user = await fetchCurrentUser();
    if (user.actor) {
        // Если в /auth/me/ уже есть вложенный actor
        return user.actor;
    }
    // Если возвращается только actor_id — можно добавить отдельный запрос
    // const response = await client.get(`/actors/actors/${user.actor_id}/`);
    // return response.data;
    return null;
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};