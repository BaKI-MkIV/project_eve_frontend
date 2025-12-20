const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// --- новые вспомогательные функции для refresh ---
const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');

    if (!refresh) throw new Error('No refresh token');

    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
    });

    if (!res.ok) throw new Error('Refresh token expired');

    const data = await res.json();
    localStorage.setItem('access_token', data.access);
    return data.access;
};

export const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem('access_token');

    const doFetch = (token) =>
        fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            },
        });

    let res = await doFetch(token);

    if (res.status !== 401) return res;

    // access истек, пробуем refresh
    try {
        token = await refreshToken();
    } catch (e) {
        logoutUser();
        throw e;
    }

    return doFetch(token);
};

// --- существующие функции ---
export const loginUser = async (login, password) => {
    const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Неверный логин или пароль');
    }

    const data = await res.json();

    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    // Новое: сразу загружаем /auth/me/ и сохраняем роль
    try {
        const userRes = await authFetch(`${API_BASE}/auth/me/`);
        const userData = await userRes.json();
        localStorage.setItem('role', userData.role); // ← вот это важно!
    } catch (err) {
        console.warn('Не удалось загрузить роль пользователя', err);
    }

    return data;
};

export const fetchCurrentUser = async () => {
    const res = await authFetch(`${API_BASE}/auth/me/`);
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
};

export const fetchCurrentActor = async () => {
    const res = await authFetch(`${API_BASE}/auth/me/actor/`);
    if (!res.ok) return null;
    return res.json();
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};
