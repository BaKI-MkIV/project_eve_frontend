import { useState, useEffect } from 'react';
import { fetchCurrentUser, logoutUser } from '../api/auth';

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await fetchCurrentUser();
                setUser(userData);
            } catch (err) {
                setError('Сессия истекла');
                setUser(null);
                logoutUser();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return { user, loading, error, setUser, setError };
};
