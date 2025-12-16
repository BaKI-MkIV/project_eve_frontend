const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

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

    return await res.json(); // { access, refresh }
};

export const fetchCurrentUser = async (token) => {
    const res = await fetch(`${API_BASE}/auth/me/`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
};

export const fetchCurrentActor = async (token) => {
    const res = await fetch(`${API_BASE}/auth/me/actor/`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;
    return await res.json();
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};