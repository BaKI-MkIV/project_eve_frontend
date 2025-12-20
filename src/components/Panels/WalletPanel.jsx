// src/components/Panels/WalletPanel.jsx

import { useState, useEffect } from 'react';
import styles from './Panel.module.css';

export default function WalletPanel() {
    const [wallet, setWallet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const role = localStorage.getItem('role');
    const selectedActorId = localStorage.getItem('selectedActorId');
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const loadWallet = async () => {
            setLoading(true);
            setError('');

            try {
                let url = '/auth/me/wallet/';
                if (role === 'master' && selectedActorId) {
                    url = `/balances/?actor=${selectedActorId}`;
                }

                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}${url}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error('Не удалось загрузить кошелёк');

                const data = await res.json();
                setWallet(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadWallet();
    }, [role, selectedActorId, token]);

    if (loading) return <div className={styles.message}>Загрузка кошелька...</div>;
    if (error) return <div className={styles.message}>{error}</div>;

    return (
        <div className={styles.container}>
            <h2>Кошелёк</h2>

            {wallet.length === 0 ? (
                <p>Кошелёк пуст</p>
            ) : (
                <div className={styles.walletGrid}>
                    {wallet.map(balance => (
                        <div key={balance.currency_code || balance.currency} className={styles.walletItem}>
                            <strong>{balance.currency_code || balance.currency?.code}</strong>
                            <div style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>
                                {parseFloat(balance.amount).toFixed(2)}
                            </div>
                            <small>{balance.currency_name || balance.currency?.name}</small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}