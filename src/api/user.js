import { authFetch } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const updateUser = async (updates) => {
    const res = await authFetch(`${API_BASE}/auth/me/update/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
            data.login?.[0] ||
            data.password?.[0] ||
            data.errors?.login?.[0] ||
            data.errors?.password?.[0] ||
            'Не удалось обновить данные'
        );
    }

    return res.json();
};


export const updateActor = async (data) => {
    // Всегда используем /auth/me/actor/ — он работает и для игрока, и для мастера
    // Мастер при имперсонации будет использовать другой эндпоинт? Нет — лучше упростить!
    // Решение: один эндпоинт для всех — /auth/me/actor/, но мастер может редактировать чужих через отдельный

    const res = await authFetch(`${API_BASE}/auth/me/actor/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
            errorData.name?.[0] ||
            errorData.description?.[0] ||
            errorData.detail ||
            'Не удалось обновить актора'
        );
    }

    return await res.json();
};

export const updateAnyActor = async (actorId, data) => {
    const res = await authFetch(`${API_BASE}/actors/${actorId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Не удалось обновить актора');
    }

    return await res.json();
};


export const fetchActors = async () => {
    const res = await authFetch(`${API_BASE}/actors/`);
    if (!res.ok) {
        throw new Error('Не удалось загрузить акторов');
    }
    return await res.json();
};