// src/components/Panels/DeveloperConsolePanel.jsx

import { useState, useEffect } from 'react';
import styles from './Panel.module.css'; // Твои стили, аналогичные другим панелям


export default function DevPanel() {
    const [users, setUsers] = useState([]);
    const [actors, setActors] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [newUserActorId, setNewUserActorId] = useState('');
    const [newUserRole, setNewUserRole] = useState('player');

    const [newActorName, setNewActorName] = useState('');
    const [newActorDescription, setNewActorDescription] = useState('');
    const [newActorType, setNewActorType] = useState('npc');
    const [newActorUserId, setNewActorUserId] = useState('');
    const [newActorIsSystem, setNewActorIsSystem] = useState(false);
    const [newActorIsHidden, setNewActorIsHidden] = useState(false);

    const [bulkActorsJson, setBulkActorsJson] = useState('');

    const [newCurrencyCode, setNewCurrencyCode] = useState('');
    const [newCurrencyName, setNewCurrencyName] = useState('');
    const [newCurrencyPrecision, setNewCurrencyPrecision] = useState(2);
    const [newCurrencyOrder, setNewCurrencyOrder] = useState(100);

    const [newProductName, setNewProductName] = useState('');
    const [newProductDescription, setNewProductDescription] = useState('');
    const [newProductBasePrice, setNewProductBasePrice] = useState('');
    const [newProductTags, setNewProductTags] = useState('');

    const [bulkProductsJson, setBulkProductsJson] = useState('');

    const [editProduct, setEditProduct] = useState(null);

    const token = localStorage.getItem('access_token');

    const loadData = async (endpoint) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`Не удалось загрузить данные из ${endpoint}`);
            return await res.json();
        } catch (err) {
            setError(err.message);
            return [];
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        setError('');

        const usersData = await loadData('users/');
        const actorsData = await loadData('actors/');
        const currenciesData = await loadData('currencies/');
        const productsData = await loadData('products/');

        setUsers(usersData);
        setActors(actorsData);
        setCurrencies(currenciesData);
        setProducts(productsData);

        setLoading(false);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleCreateUser = async () => {
        setError('');
        try {
            const data = {
                actor_id: newUserActorId || null,
                role: newUserRole,
            };
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/users/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Не удалось создать пользователя');
            const created = await res.json();
            alert(`Создан пользователь: login=${created.login}, password=${created.raw_password}`);
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Удалить пользователя?')) return;
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/users/${id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Не удалось удалить пользователя');
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateActor = async () => {
        setError('');
        try {
            const data = {
                name: newActorName,
                description: newActorDescription,
                type: newActorType,
                user: newActorUserId || null,
                is_system: newActorIsSystem,
                is_hidden: newActorIsHidden,
            };
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/actors/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Не удалось создать актора');
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBulkCreateActors = async () => {
        setError('');
        try {
            const jsonData = JSON.parse(bulkActorsJson);
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/actors/bulk_create/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(jsonData),
            });
            if (!res.ok) throw new Error('Не удалось создать акторов bulk');
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteActor = async (id) => {
        if (!window.confirm('Удалить актора?')) return;
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/actors/${id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Не удалось удалить актора');
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateCurrency = async () => {
        setError('');
        try {
            const data = {
                code: newCurrencyCode,
                name: newCurrencyName,
                precision: parseInt(newCurrencyPrecision),
                order: parseInt(newCurrencyOrder),
            };
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/currencies/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Не удалось создать валюту');
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateProduct = async () => {
        setError('');
        try {
            const tags = newProductTags.split(',').map(t => t.trim()).filter(t => t);
            const data = {
                name: newProductName,
                description: newProductDescription,
                base_price: parseFloat(newProductBasePrice),
                tags,
            };
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/products/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Не удалось создать продукт');
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBulkCreateProducts = async () => {
        setError('');
        try {
            const jsonData = JSON.parse(bulkProductsJson);
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/products/bulk_create/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(jsonData),
            });
            if (!res.ok) throw new Error('Не удалось создать продукты bulk');
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
        setNewProductName(product.name);
        setNewProductDescription(product.description || '');
        setNewProductBasePrice(product.base_price);
        setNewProductTags(product.tags.join(', '));
    };

    const handleUpdateProduct = async () => {
        setError('');
        try {
            const tags = newProductTags.split(',').map(t => t.trim()).filter(t => t);
            const data = {
                name: newProductName,
                description: newProductDescription,
                base_price: parseFloat(newProductBasePrice),
                tags,
            };
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/products/${editProduct.id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Не удалось обновить продукт');
            setEditProduct(null);
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Удалить продукт?')) return;
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/products/${id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Не удалось удалить продукт');
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>

            {error && <p className="error">{error}</p>}

            {/* Пользователи */}
            <div className={styles.section}>
                <h3>Пользователи</h3>
                <form className={styles.form}>
                    <input
                        type="number"
                        value={newUserActorId}
                        onChange={e => setNewUserActorId(e.target.value)}
                        placeholder="Actor ID"
                    />
                    <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
                        <option value="player">Player</option>
                        <option value="master">Master</option>
                    </select>
                    <button type="button" onClick={handleCreateUser}>Создать юзера</button>
                </form>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Login</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.login}</td>
                            <td>{u.role}</td>
                            <td>{u.created_at}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(u.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Акторы */}
            <div className={styles.section}>
                <h3>Акторы</h3>
                <form className={styles.form}>
                    <input
                        value={newActorName}
                        onChange={e => setNewActorName(e.target.value)}
                        placeholder="Имя"
                    />
                    <textarea
                        value={newActorDescription}
                        onChange={e => setNewActorDescription(e.target.value)}
                        placeholder="Описание"
                    />
                    <select value={newActorType} onChange={e => setNewActorType(e.target.value)}>
                        <option value="player">Player</option>
                        <option value="npc">NPC</option>
                        <option value="bank">Bank</option>
                        <option value="merchant">Merchant</option>
                        <option value="system">System</option>
                    </select>
                    <input
                        type="number"
                        value={newActorUserId}
                        onChange={e => setNewActorUserId(e.target.value)}
                        placeholder="User ID"
                    />
                    <label><input type="checkbox" checked={newActorIsSystem} onChange={e => setNewActorIsSystem(e.target.checked)} /> Is System</label>
                    <label><input type="checkbox" checked={newActorIsHidden} onChange={e => setNewActorIsHidden(e.target.checked)} /> Is Hidden</label>
                    <button type="button" onClick={handleCreateActor}>Создать актора</button>
                </form>

                <textarea
                    value={bulkActorsJson}
                    onChange={e => setBulkActorsJson(e.target.value)}
                    placeholder="JSON для bulk акторов"
                    className={styles.jsonTextarea}
                />
                <button onClick={handleBulkCreateActors}>Bulk создать акторов</button>

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>User ID</th>
                        <th>System</th>
                        <th>Hidden</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {actors.map(a => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.name}</td>
                            <td>{a.description}</td>
                            <td>{a.type}</td>
                            <td>{a.user || '—'}</td>
                            <td>{a.is_system ? 'Да' : 'Нет'}</td>
                            <td>{a.is_hidden ? 'Да' : 'Нет'}</td>
                            <td>
                                {!a.user && <button onClick={() => handleDeleteActor(a.id)}>Удалить</button>}
                                {a.user && <span>Привязан к юзеру, нельзя удалить</span>}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Валюты */}
            <div className={styles.section}>
                <h3>Валюты</h3>
                <form className={styles.form}>
                    <input
                        value={newCurrencyCode}
                        onChange={e => setNewCurrencyCode(e.target.value)}
                        placeholder="Code (GP)"
                    />
                    <input
                        value={newCurrencyName}
                        onChange={e => setNewCurrencyName(e.target.value)}
                        placeholder="Name (Gold Pieces)"
                    />
                    <input
                        type="number"
                        value={newCurrencyPrecision}
                        onChange={e => setNewCurrencyPrecision(e.target.value)}
                        placeholder="Precision (2)"
                    />
                    <input
                        type="number"
                        value={newCurrencyOrder}
                        onChange={e => setNewCurrencyOrder(e.target.value)}
                        placeholder="Order (100)"
                    />
                    <button type="button" onClick={handleCreateCurrency}>Создать валюту</button>
                </form>

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Precision</th>
                        <th>Order</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currencies.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.code}</td>
                            <td>{c.name}</td>
                            <td>{c.precision}</td>
                            <td>{c.order}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Предметы */}
            <div className={styles.section}>
                <h3>Предметы</h3>
                <form className={styles.form}>
                    <input
                        value={newProductName}
                        onChange={e => setNewProductName(e.target.value)}
                        placeholder="Name"
                    />
                    <textarea
                        value={newProductDescription}
                        onChange={e => setNewProductDescription(e.target.value)}
                        placeholder="Description"
                    />
                    <input
                        type="number"
                        value={newProductBasePrice}
                        onChange={e => setNewProductBasePrice(e.target.value)}
                        placeholder="Base Price"
                    />
                    <input
                        value={newProductTags}
                        onChange={e => setNewProductTags(e.target.value)}
                        placeholder="Tags (comma separated)"
                    />
                    <button type="button" onClick={handleCreateProduct}>Создать предмет</button>
                </form>

                <textarea
                    value={bulkProductsJson}
                    onChange={e => setBulkProductsJson(e.target.value)}
                    placeholder="JSON для bulk продуктов"
                    className={styles.jsonTextarea}
                />
                <button onClick={handleBulkCreateProducts}>Bulk создать предметы</button>

                {editProduct && (
                    <form className={styles.form}>
                        <h4>Редактировать {editProduct.name}</h4>
                        <input
                            value={newProductName}
                            onChange={e => setNewProductName(e.target.value)}
                            placeholder="Name"
                        />
                        <textarea
                            value={newProductDescription}
                            onChange={e => setNewProductDescription(e.target.value)}
                            placeholder="Description"
                        />
                        <input
                            type="number"
                            value={newProductBasePrice}
                            onChange={e => setNewProductBasePrice(e.target.value)}
                            placeholder="Base Price"
                        />
                        <input
                            value={newProductTags}
                            onChange={e => setNewProductTags(e.target.value)}
                            placeholder="Tags"
                        />
                        <button type="button" onClick={handleUpdateProduct}>Сохранить</button>
                        <button type="button" onClick={() => setEditProduct(null)}>Отмена</button>
                    </form>
                )}

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Base Price</th>
                        <th>Tags</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                            <td>{p.base_price}</td>
                            <td>{p.tags.join(', ')}</td>
                            <td>
                                <button onClick={() => handleEditProduct(p)}>Редактировать</button>
                                <button onClick={() => handleDeleteProduct(p.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}