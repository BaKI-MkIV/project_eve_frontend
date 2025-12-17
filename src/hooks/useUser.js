// src/hooks/useUser.js
import { useState, useEffect } from 'react';
import { fetchCurrentUser } from '../api/auth';
import { logoutUser } from '../api/auth';

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const loadUser = async () => {
            try {
                const userData = await fetchCurrentUser(token);
                setUser(userData);
            } catch (err) {
                setError(err.message || 'Ошибка загрузки пользователя');
                logoutUser();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    return { user, loading, error, setUser, setError };
};