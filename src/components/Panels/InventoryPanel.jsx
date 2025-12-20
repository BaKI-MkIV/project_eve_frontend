// src/components/Panels/InventoryPanel.jsx

import { useState, useEffect } from 'react';
import styles from './Panel.module.css';

export default function InventoryPanel() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const role = localStorage.getItem('role');
    const selectedActorId = localStorage.getItem('selectedActorId');
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const loadInventory = async () => {
            setLoading(true);
            setError('');

            try {
                let url = '/auth/me/inventory/';
                if (role === 'master' && selectedActorId) {
                    url = `/items/?actor=${selectedActorId}`;
                }

                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}${url}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error('Не удалось загрузить инвентарь');

                const data = await res.json();
                setInventory(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadInventory();
    }, [role, selectedActorId, token]);

    if (loading) return <div className={styles.message}>Загрузка инвентаря...</div>;
    if (error) return <div className={styles.message}>{error}</div>;

    return (
        <div className={styles.container}>
            <h2>Инвентарь</h2>

            {inventory.length === 0 ? (
                <p>Инвентарь пуст</p>
            ) : (
                <div className={styles.cardsContainer}>
                    {inventory.map(item => (
                        <div key={item.product?.id || item.id} className={styles.card}>
                            <h4>{item.product_name || item.product?.name}</h4>
                            <p><strong>Количество:</strong> {parseFloat(item.quantity).toFixed(2)}</p>
                            {item.base_price && <p><strong>Базовая цена:</strong> {item.base_price}</p>}
                            {item.product_description && <p>{item.product_description}</p>}
                            {item.product?.description && <p>{item.product.description}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}