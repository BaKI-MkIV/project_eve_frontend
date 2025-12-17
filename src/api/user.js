// src/api/user.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const updateUser = async (token, updates) => {
    const res = await fetch(`${API_BASE}/auth/me/update/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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