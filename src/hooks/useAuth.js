// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { getMe, logout } from '../api/services/authService';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            getMe()
                .then(setUser)
                .catch(() => logout())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const loginUser = (userData) => setUser(userData);
    const logoutUser = () => {
        logout();
        setUser(null);
    };

    return { user, loading, loginUser, logoutUser };
};