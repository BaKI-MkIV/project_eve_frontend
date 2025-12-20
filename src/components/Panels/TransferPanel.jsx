// src/components/Panels/TransferPanel.jsx

import { useState, useEffect } from 'react';
import styles from './Panel.module.css';

export default function TransferPanel() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [toActorId, setToActorId] = useState('');
    const [type, setType] = useState('money'); // 'money' или 'item'
    const [currencyId, setCurrencyId] = useState('');
    const [productId, setProductId] = useState('');
    const [amount, setAmount] = useState('');
    const [generate, setGenerate] = useState(false);
    const [currencies, setCurrencies] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const role = localStorage.getItem('role');
    const selectedActorId = localStorage.getItem('selectedActorId');
    const token = localStorage.getItem('access_token');

    // Загружаем валюты и продукты (для выбора)
    useEffect(() => {
        const loadData = async () => {
            try {
                const [currRes, prodRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/currencies/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/products/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                if (currRes.ok) setCurrencies(await currRes.json());
                if (prodRes.ok) setProducts(await prodRes.json());
            } catch (err) {
                console.warn('Не удалось загрузить валюты/продукты', err);
            }
        };

        loadData();
    }, [token]);

    // Поиск получателей по имени (акторы + юзеры)
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        const search = async () => {
            setLoading(true);
            try {
                const [actorsRes, usersRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/actors/?search=${searchQuery}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/users/?search=${searchQuery}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const actors = actorsRes.ok ? await actorsRes.json() : [];
                const users = usersRes.ok ? await usersRes.json() : [];

                const actorSuggestions = actors.map(a => ({
                    id: a.id,
                    name: a.name,
                    type: 'actor',
                    extra: a.type,
                    userLogin: a.user ? users.find(u => u.actor === a.id)?.login : null
                }));

                const userSuggestions = users
                    .filter(u => u.actor) // только с актором
                    .map(u => ({
                        id: u.actor,
                        name: actors.find(a => a.id === u.actor)?.name || u.login,
                        type: 'user',
                        extra: u.login
                    }));

                // Объединяем и убираем дубли
                const combined = [...actorSuggestions, ...userSuggestions];
                const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

                setSuggestions(unique);
            } catch (err) {
                setError('Ошибка поиска');
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery, token]);

    const handleTransfer = async () => {
        setError('');
        setSuccess('');

        if (!toActorId) return setError('Выберите получателя');
        if (!amount || parseFloat(amount) <= 0) return setError('Укажите корректную сумму');
        if (type === 'money' && !currencyId) return setError('Выберите валюту');
        if (type === 'item' && !productId) return setError('Выберите предмет');

        const data = {
            to_actor: Number(toActorId),  // ← всегда передаём явно
            from_actor: role === 'master' && selectedActorId ? Number(selectedActorId) : null,
            type,
            requested_amount: parseFloat(amount),
            generate: role === 'master' && generate,
        };

        if (type === 'money') data.currency = Number(currencyId);
        if (type === 'item') data.product = Number(productId);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/transfer-requests/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || 'Ошибка перевода');
            }

            setSuccess('Перевод отправлен успешно');
            setAmount('');
            setSearchQuery('');
            setToActorId('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Перевод ресурсов</h2>

            {error && <p className="error">{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}

            <div className={styles.field}>
                <label>Тип перевода</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="money">Деньги</option>
                    <option value="item">Предмет</option>
                </select>
            </div>

            <div className={styles.field}>
                <label>Получатель (поиск по имени или логину)</label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Начните вводить имя..."
                />
                {suggestions.length > 0 && (
                    <div className={styles.suggestions}>
                        {suggestions.map(s => (
                            <div
                                key={s.id}
                                className={styles.suggestion}
                                onClick={() => {
                                    setToActorId(s.id);
                                    setSearchQuery(`${s.name} ${s.userLogin ? `(${s.userLogin})` : ''}`);
                                    setSuggestions([]);
                                }}
                            >
                                <strong>{s.name}</strong>
                                {s.userLogin && <small> ({s.userLogin})</small>}
                                <small style={{marginLeft: '10px', color: '#666'}}>{s.type === 'actor' ? s.extra : 'игрок'}</small>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {type === 'money' && (
                <div className={styles.field}>
                    <label>Валюта</label>
                    <select value={currencyId} onChange={e => setCurrencyId(e.target.value)}>
                        <option value="">Выберите валюту</option>
                        {currencies.map(c => (
                            <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {type === 'item' && (
                <div className={styles.field}>
                    <label>Предмет</label>
                    <select value={productId} onChange={e => setProductId(e.target.value)}>
                        <option value="">Выберите предмет</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className={styles.field}>
                <label>Количество / Сумма</label>
                <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                />
            </div>

            {role === 'master' && (
                <label>
                    <input
                        type="checkbox"
                        checked={generate}
                        onChange={e => setGenerate(e.target.checked)}
                    />
                    Генерировать из воздуха (для системных акторов)
                </label>
            )}

            <button onClick={handleTransfer} disabled={loading}>
                Отправить {type === 'money' ? 'деньги' : 'предмет'}
            </button>
        </div>
    );
}